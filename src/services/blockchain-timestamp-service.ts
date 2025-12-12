/**
 * Blockchain Timestamp Service (Simplified)
 *
 * Unified interface for timestamping on:
 * - Bitcoin via OpenTimestamps (free, ~1 hour)
 * - Ethereum/Polygon (costs gas, ~15 seconds)
 */

import { timestampRepository } from "@/features/timestamp/db/timestamps"
import { type BlockchainId, isOTSBlockchain } from "@/lib/blockchain"
import {
	createEthTimestamp,
	type SupportedChain,
	verifyEthTimestamp
} from "./ethereum-service"
import { otsStamp, otsUpgrade, otsVerify } from "./opentimestamps-service"

// ============================================================================
// TYPES
// ============================================================================

export interface TimestampResult {
	success: boolean
	blockchain: BlockchainId
	contentHash: string
	status: "pending" | "processing" | "confirmed" | "error"
	transactionHash?: string
	otsProof?: string
	blockNumber?: number
	explorerUrl?: string
	message: string
	error?: string
}

export interface VerifyResult {
	verified: boolean
	blockchain: BlockchainId
	attestedTime?: Date
	blockNumber?: number
	message: string
	error?: string
}

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Create timestamp on specified blockchain
 */
export async function createBlockchainTimestamp(
	sha256Hash: string,
	blockchain: BlockchainId
): Promise<TimestampResult> {
	const baseResult = { blockchain, contentHash: sha256Hash }

	if (isOTSBlockchain(blockchain)) {
		const result = await otsStamp(sha256Hash)

		if (!result.success) {
			return {
				...baseResult,
				success: false,
				status: "error",
				message: result.message,
				error: result.error
			}
		}

		return {
			...baseResult,
			success: true,
			status: "pending",
			otsProof: result.otsProofBase64,
			message: result.message
		}
	}

	// EVM chains
	const result = await createEthTimestamp(
		sha256Hash,
		blockchain as SupportedChain
	)

	if (!result.success) {
		return {
			...baseResult,
			success: false,
			status: "error",
			message: result.message,
			error: result.error
		}
	}

	return {
		...baseResult,
		success: true,
		status: result.status,
		transactionHash: result.transactionHash,
		blockNumber: result.blockNumber ? Number(result.blockNumber) : undefined,
		explorerUrl: result.explorerUrl,
		message: result.message
	}
}

/**
 * Verify timestamp on blockchain
 */
export async function verifyBlockchainTimestamp(
	blockchain: BlockchainId,
	sha256Hash: string,
	proof: { transactionHash?: string; otsProof?: string }
): Promise<VerifyResult> {
	if (isOTSBlockchain(blockchain)) {
		if (!proof.otsProof) {
			return {
				verified: false,
				blockchain,
				message: "No OTS proof provided",
				error: "Missing otsProof"
			}
		}

		const result = await otsVerify(proof.otsProof, sha256Hash)

		return {
			verified: result.status === "confirmed",
			blockchain,
			attestedTime: result.attestedTime,
			blockNumber: result.blockHeight,
			message: result.message,
			error: result.error
		}
	}

	// EVM chains
	if (!proof.transactionHash) {
		return {
			verified: false,
			blockchain,
			message: "No transaction hash provided",
			error: "Missing transactionHash"
		}
	}

	const result = await verifyEthTimestamp(
		proof.transactionHash as `0x${string}`,
		sha256Hash,
		blockchain as SupportedChain
	)

	return {
		verified: result.verified,
		blockchain,
		attestedTime: result.timestamp,
		blockNumber: result.blockNumber ? Number(result.blockNumber) : undefined,
		message: result.message,
		error: result.error
	}
}

/**
 * Upgrade pending OTS timestamps (run periodically via cron)
 */
export async function upgradePendingOTSTimestamps(): Promise<{
	checked: number
	upgraded: number
	errors: number
}> {
	const stats = { checked: 0, upgraded: 0, errors: 0 }

	try {
		const pending = await timestampRepository.findPendingOTS()

		for (const ts of pending) {
			stats.checked++
			if (!ts.otsProof) continue

			try {
				const result = await otsUpgrade(ts.otsProof, ts.contentHash)

				if (result.status === "confirmed") {
					await timestampRepository.update(ts.id, {
						status: "confirmed",
						otsProof: result.otsProofBase64,
						otsPending: 0,
						blockNumber: result.blockHeight,
						confirmedAt: result.attestedTime?.toISOString()
					})
					stats.upgraded++
				}
			} catch {
				stats.errors++
			}
		}
	} catch (error) {
		console.error("upgradePendingOTSTimestamps error:", error)
	}

	return stats
}

export type { BlockchainId as BlockchainType } from "@/lib/blockchain"
// Re-export blockchain info for convenience
export { BLOCKCHAINS as BLOCKCHAIN_INFO } from "@/lib/blockchain"
