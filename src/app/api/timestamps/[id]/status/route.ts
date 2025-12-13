import { NextResponse } from "next/server"
import { timestampRepository } from "@/features/timestamp/db/timestamps"
import { type BlockchainId, isOTSBlockchain } from "@/lib/blockchain"
import {
	otsGetCalendarStatus,
	otsUpgrade
} from "@/services/opentimestamps-service"

interface RouteParams {
	params: Promise<{ id: string }>
}

/**
 * GET /api/timestamps/[id]/status
 *
 * Get detailed status of a specific timestamp, including:
 * - Database status
 * - Age of timestamp
 * - For OTS: calendar server status and upgrade attempt
 */
export async function GET(_request: Request, { params }: RouteParams) {
	try {
		const { id } = await params

		// Find timestamp in database
		const timestamp = await timestampRepository.findById(id)
		if (!timestamp) {
			return NextResponse.json(
				{ error: "Timestamp not found" },
				{ status: 404 }
			)
		}

		const ageMinutes = Math.round(
			(Date.now() - new Date(timestamp.createdAt).getTime()) / 60000
		)

		const response: Record<string, unknown> = {
			id: timestamp.id,
			blockchain: timestamp.blockchain,
			status: timestamp.status,
			createdAt: timestamp.createdAt,
			ageMinutes,
			contentHash: timestamp.contentHash,
			transactionHash: timestamp.transactionHash,
			blockNumber: timestamp.blockNumber,
			confirmedAt: timestamp.confirmedAt,
			hasOtsProof: !!timestamp.otsProof,
			otsPending: timestamp.otsPending
		}

		// For OTS timestamps, try to get more details
		if (
			isOTSBlockchain(timestamp.blockchain as BlockchainId) &&
			timestamp.otsProof
		) {
			// Get calendar status
			const calendarStatus = await otsGetCalendarStatus(timestamp.otsProof)
			response.calendarStatus = calendarStatus

			// Try upgrade if still pending
			if (timestamp.otsPending === 1) {
				const upgradeResult = await otsUpgrade(
					timestamp.otsProof,
					timestamp.contentHash
				)
				response.upgradeAttempt = {
					status: upgradeResult.status,
					message: upgradeResult.message,
					blockHeight: upgradeResult.blockHeight,
					attestedTime: upgradeResult.attestedTime
				}

				// If confirmed, update the database
				if (upgradeResult.status === "confirmed") {
					await timestampRepository.update(timestamp.id, {
						status: "confirmed",
						otsProof: upgradeResult.otsProofBase64,
						otsPending: 0,
						blockNumber: upgradeResult.blockHeight,
						confirmedAt: upgradeResult.attestedTime?.toISOString()
					})
					response.status = "confirmed"
					response.justUpgraded = true
				}
			}
		}

		return NextResponse.json(response)
	} catch (error) {
		console.error("Error getting timestamp status:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}
