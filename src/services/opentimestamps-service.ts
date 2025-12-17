/**
 * OpenTimestamps Service (Simplified)
 *
 * IMPORTANT: Requires SHA-256 hash (32 bytes), NOT SHA-512!
 */
import { upgrade } from "@lacrypta/typescript-opentimestamps"
import crypto from "crypto"
import { writeFileSync } from "fs"

// ============================================================================
// TYPES
// ============================================================================

export interface OTSResult {
	success: boolean
	status: "pending" | "confirmed" | "error"
	otsProofBase64?: string
	attestedTime?: Date
	message: string
	error?: string
}

// ============================================================================
// HELPERS
// ============================================================================

function contentToHash256(content: string): Buffer {
	writeFileSync("data-to-hash.txt", content);
	const hash = crypto.createHash("sha256").update(content).digest()
	console.log("Computed SHA-256 Hash:", hash.toString("hex"));
	return hash
}
// ============================================================================
// CALENDAR STATUS (for debugging)
// ============================================================================

export interface CalendarStatusResult {
	calendars: Array<{
		name: string
		url: string
		status: "pending" | "confirmed" | "error"
		message: string
	}>
	overallStatus: "pending" | "confirmed" | "error"
}

/**
 * Check the status of OTS proof with calendar servers
 * This helps debug why a timestamp might still be pending
 */
export async function otsGetCalendarStatus(
	otsProofBase64: string
): Promise<CalendarStatusResult> {
	const calendars = [
		{ name: "Alice", url: "https://alice.btc.calendar.opentimestamps.org" },
		{ name: "Bob", url: "https://bob.btc.calendar.opentimestamps.org" },
		{ name: "Finney", url: "https://finney.calendar.eternitywall.com" }
	]

	const results: CalendarStatusResult["calendars"] = []
	let hasConfirmed = false

	// Try to decode the proof to see what calendars it references
	try {
		const proof = Buffer.from(otsProofBase64, "base64")

		// Check each calendar
		for (const calendar of calendars) {
			try {
				// Simple check: try to upgrade via this calendar
				// The OTS client internally checks the calendar
				// const upgraded = await upgrade(proof)

				// If we get here without error, the calendar responded
				results.push({
					name: calendar.name,
					url: calendar.url,
					status: upgraded.length > proof.length ? "confirmed" : "pending",
					message:
						upgraded.length > proof.length
							? "Attestation available"
							: "Still aggregating"
				})

				if (upgraded.length > proof.length) {
					hasConfirmed = true
				}

				// Only need one successful check
				break
			} catch {
				results.push({
					name: calendar.name,
					url: calendar.url,
					status: "pending",
					message: "Waiting for Bitcoin confirmation"
				})
			}
		}
	} catch (error) {
		return {
			calendars: [
				{
					name: "Unknown",
					url: "",
					status: "error",
					message:
						error instanceof Error ? error.message : "Failed to parse proof"
				}
			],
			overallStatus: "error"
		}
	}

	return {
		calendars: results,
		overallStatus: hasConfirmed ? "confirmed" : "pending"
	}
}
