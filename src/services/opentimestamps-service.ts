/**
 * OpenTimestamps Service (Simplified)
 *
 * Uses @alexalves87/opentimestamps-client for Bitcoin timestamping.
 * IMPORTANT: Requires SHA-256 hash (32 bytes), NOT SHA-512!
 */

import {
	OpenTimestampsClient,
	StampError,
	UpgradeError,
	ValidationError
} from "@alexalves87/opentimestamps-client"

const otsClient = new OpenTimestampsClient()

// ============================================================================
// TYPES
// ============================================================================

export interface OTSResult {
	success: boolean
	status: "pending" | "confirmed" | "error"
	otsProofBase64?: string
	blockHeight?: number
	attestedTime?: Date
	message: string
	error?: string
}

// ============================================================================
// HELPERS
// ============================================================================

/** Convert hex string to 32-byte Buffer. Returns undefined if invalid. */
function toHash32(hash: string | Buffer): Buffer | undefined {
	const buf =
		typeof hash === "string"
			? Buffer.from(hash.replace(/^0x/, ""), "hex")
			: hash
	return buf.length === 32 ? buf : undefined
}

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Create OTS timestamp from SHA-256 hash
 */
export async function otsStamp(sha256Hash: string): Promise<OTSResult> {
	try {
		const hash = toHash32(sha256Hash)
		if (!hash) {
			return {
				success: false,
				status: "error",
				message: "Hash must be 32 bytes (SHA-256)",
				error: "Invalid hash length"
			}
		}

		const proof = await otsClient.stamp(hash)

		return {
			success: true,
			status: "pending",
			otsProofBase64: proof.toString("base64"),
			message: "Submitted to calendar. Confirmation in ~10-60 min."
		}
	} catch (error) {
		const msg = error instanceof Error ? error.message : "Unknown error"
		if (error instanceof ValidationError || error instanceof StampError) {
			return { success: false, status: "error", message: msg, error: msg }
		}
		return {
			success: false,
			status: "error",
			message: "Stamp failed",
			error: msg
		}
	}
}

/**
 * Upgrade pending OTS proof (fetch Bitcoin attestation)
 */
export async function otsUpgrade(
	otsProofBase64: string,
	sha256Hash?: string
): Promise<OTSResult> {
	try {
		const proof = Buffer.from(otsProofBase64, "base64")
		const upgraded = await otsClient.upgrade(proof)
		const upgradedBase64 = upgraded.toString("base64")

		// Check if now confirmed
		const verification = await otsVerify(upgradedBase64, sha256Hash)

		return {
			success: true,
			status:
				verification.success && verification.status === "confirmed"
					? "confirmed"
					: "pending",
			otsProofBase64: upgradedBase64,
			blockHeight: verification.blockHeight,
			attestedTime: verification.attestedTime,
			message: verification.message
		}
	} catch (error) {
		if (error instanceof UpgradeError) {
			return {
				success: true,
				status: "pending",
				otsProofBase64,
				message: "Still pending. Bitcoin confirmation takes ~10-60 min."
			}
		}
		return {
			success: false,
			status: "error",
			message: "Upgrade failed",
			error: error instanceof Error ? error.message : "Unknown error"
		}
	}
}

/**
 * Verify OTS proof against optional hash
 */
export async function otsVerify(
	otsProofBase64: string,
	sha256Hash?: string
): Promise<OTSResult> {
	try {
		const proof = Buffer.from(otsProofBase64, "base64")
		const hash = sha256Hash ? toHash32(sha256Hash) : undefined

		if (sha256Hash && !hash) {
			return {
				success: false,
				status: "error",
				message: "Hash must be 32 bytes (SHA-256)",
				error: "Invalid hash length"
			}
		}

		const result = await otsClient.verify(proof, hash)

		if (result.valid) {
			return {
				success: true,
				status: "confirmed",
				otsProofBase64,
				blockHeight: result.blockHeight,
				attestedTime: result.timestamp
					? new Date(result.timestamp * 1000)
					: undefined,
				message: "Verified! Content existed before Bitcoin block."
			}
		}

		return {
			success: true,
			status: "pending",
			otsProofBase64,
			message: result.error || "Pending Bitcoin confirmation"
		}
	} catch (error) {
		return {
			success: false,
			status: "error",
			message: "Verification failed",
			error: error instanceof Error ? error.message : "Unknown error"
		}
	}
}
