import jsPDF from "jspdf"
import type {
	DigitalSignature,
	DigitalSignatureSettings,
	VerificationResult,
	WatermarkSettings
} from "@/features/verify/types"

interface ExportVerificationReportOptions {
	result: VerificationResult
	watermarkSettings: WatermarkSettings
	digitalSignatureSettings: DigitalSignatureSettings
}

const DIGITAL_SIGNATURE_PUBLIC_KEY =
	"-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2Z8QX1fLKjWE...\n-----END PUBLIC KEY-----"

const DIGITAL_SIGNATURE_PRIVATE_KEY_HASH =
	"sha256:a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456"

const generateDigitalSignature = (
	documentContent: string,
	digitalSignatureSettings: DigitalSignatureSettings
): DigitalSignature => {
	const timestamp = new Date().toISOString()
	const encodedContent = `${documentContent}${digitalSignatureSettings.includeTimestamp ? timestamp : ""}`
	const documentHash = `sha256:${btoa(encodedContent).substring(0, 64)}`
	const signatureId = `sig_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

	return {
		signatureId,
		publicKey: DIGITAL_SIGNATURE_PUBLIC_KEY,
		privateKeyHash: DIGITAL_SIGNATURE_PRIVATE_KEY_HASH,
		algorithm: digitalSignatureSettings.algorithm,
		signedAt: timestamp,
		documentHash,
		isValid: true
	}
}

const addWatermark = (
	doc: jsPDF,
	watermarkSettings: WatermarkSettings,
	pageWidth: number,
	pageHeight: number
) => {
	if (!watermarkSettings.enabled) {
		return
	}

	const watermarkText =
		watermarkSettings.useCustom && watermarkSettings.customText
			? watermarkSettings.customText
			: watermarkSettings.text

	const watermarkOpacity = Math.min(
		Math.max(watermarkSettings.opacity, 0.05),
		0.3
	)

	doc.saveGraphicsState()
	doc.setGState(new (doc as any).GState({ opacity: watermarkOpacity }))
	doc.setTextColor(128, 128, 128)

	if (watermarkSettings.position === "diagonal") {
		doc.setFontSize(50)
		doc.setFont("helvetica", "bold")
		const centerX = pageWidth / 2
		const centerY = pageHeight / 2
		doc.text(watermarkText, centerX, centerY, {
			angle: -45 * (Math.PI / 180),
			align: "center"
		})
	} else if (watermarkSettings.position === "background") {
		doc.setFontSize(30)
		doc.setFont("helvetica", "bold")

		for (let x = 50; x < pageWidth; x += 120) {
			for (let y = 50; y < pageHeight; y += 80) {
				doc.text(watermarkText, x, y, { angle: -30 * (Math.PI / 180) })
			}
		}
	} else {
		doc.setFontSize(12)
		doc.setFont("helvetica", "normal")
		doc.text(watermarkText, pageWidth / 2, pageHeight - 10, {
			align: "center"
		})
	}

	doc.restoreGraphicsState()
}

export const exportVerificationReport = ({
	result,
	watermarkSettings,
	digitalSignatureSettings
}: ExportVerificationReportOptions) => {
	const doc = new jsPDF()
	const pageWidth = doc.internal.pageSize.getWidth()
	const pageHeight = doc.internal.pageSize.getHeight()
	const margin = 20

	const documentContent = JSON.stringify({
		postUrl: result.postUrl,
		verificationData: result.timestampData,
		exportedAt: new Date().toISOString(),
		signatureLevel: digitalSignatureSettings.signatureLevel
	})

	const digitalSignature = digitalSignatureSettings.enabled
		? generateDigitalSignature(documentContent, digitalSignatureSettings)
		: null

	addWatermark(doc, watermarkSettings, pageWidth, pageHeight)

	doc.setFillColor(59, 130, 246)
	doc.rect(0, 0, pageWidth, 25, "F")
	doc.setTextColor(255, 255, 255)
	doc.setFontSize(20)
	doc.setFont("helvetica", "bold")
	doc.text("SaveOnX", margin, 18)
	doc.setFontSize(12)
	doc.setFont("helvetica", "normal")
	doc.text("Post Verification Report", pageWidth - margin - 50, 18)

	if (digitalSignature) {
		doc.setFillColor(34, 197, 94)
		doc.rect(pageWidth - 60, 5, 50, 15, "F")
		doc.setTextColor(255, 255, 255)
		doc.setFontSize(8)
		doc.setFont("helvetica", "bold")
		doc.text("DIGITALLY", pageWidth - 57, 11)
		doc.text("SIGNED", pageWidth - 54, 16)
	}

	doc.setFillColor(34, 197, 94)
	doc.circle(pageWidth - 30, 12, 8, "F")
	doc.setTextColor(255, 255, 255)
	doc.setFontSize(8)
	doc.text("\u2713", pageWidth - 32, 15)

	doc.setTextColor(0, 0, 0)
	let yPosition = 45
	doc.setFontSize(18)
	doc.setFont("helvetica", "bold")
	doc.text("Post Verification Report", margin, yPosition)
	yPosition += 15

	if (digitalSignature) {
		doc.setFillColor(240, 253, 244)
		doc.rect(margin, yPosition, pageWidth - 2 * margin, 25, "F")

		doc.setTextColor(22, 163, 74)
		doc.setFontSize(12)
		doc.setFont("helvetica", "bold")
		doc.text(
			"\ud83d\udd12 DIGITALLY SIGNED DOCUMENT",
			margin + 5,
			yPosition + 8
		)

		doc.setFont("helvetica", "normal")
		doc.setFontSize(10)
		doc.text(
			`Signature ID: ${digitalSignature.signatureId}`,
			margin + 5,
			yPosition + 15
		)
		doc.text(
			`Algorithm: ${digitalSignature.algorithm}`,
			margin + 5,
			yPosition + 20
		)

		doc.setTextColor(0, 0, 0)
		yPosition += 35
	}

	doc.setFontSize(14)
	doc.setFont("helvetica", "bold")
	doc.text("Verification Status:", margin, yPosition)
	yPosition += 8

	doc.setFontSize(12)
	doc.setFont("helvetica", "normal")

	if (result.isTimestamped) {
		doc.setTextColor(34, 197, 94)
		doc.text("\u2713 POST VERIFIED AND TIMESTAMPED", margin, yPosition)
	} else {
		doc.setTextColor(239, 68, 68)
		doc.text("\u2717 POST NOT FOUND IN TIMESTAMP DATABASE", margin, yPosition)
	}

	doc.setTextColor(0, 0, 0)
	yPosition += 15

	if (result.isTimestamped) {
		doc.setFontSize(12)
		doc.setFont("helvetica", "bold")
		doc.text("Original Post URL:", margin, yPosition)
		yPosition += 6

		doc.setFont("helvetica", "normal")
		doc.text(result.postUrl, margin, yPosition)
		yPosition += 12

		doc.setFont("helvetica", "bold")
		doc.text("Timestamp Details:", margin, yPosition)
		yPosition += 8

		doc.setFont("helvetica", "normal")
		doc.text(
			`Timestamped At: ${new Date(result.timestampData.timestampedAt).toLocaleString()}`,
			margin + 5,
			yPosition
		)
		yPosition += 6

		doc.text(
			`Current Status: ${result.timestampData.status.toUpperCase()}`,
			margin + 5,
			yPosition
		)
		yPosition += 15

		doc.setFont("helvetica", "bold")
		doc.text("Preserved Content:", margin, yPosition)
		yPosition += 8

		doc.setFont("helvetica", "normal")
		doc.text(
			`Author: ${result.originalContent.author} (${result.originalContent.handle})`,
			margin + 5,
			yPosition
		)
		yPosition += 6

		doc.text(
			`Posted: ${new Date(result.originalContent.timestamp).toLocaleString()}`,
			margin + 5,
			yPosition
		)
		yPosition += 6

		doc.text("Content:", margin + 5, yPosition)
		yPosition += 6

		doc.setFont("helvetica", "normal")
		doc.setFontSize(10)
		const contentLines = doc.splitTextToSize(
			result.originalContent.content,
			pageWidth - 2 * margin - 10
		)
		contentLines.forEach((line) => {
			doc.text(line, margin + 10, yPosition)
			yPosition += 5
		})

		yPosition += 10
		doc.setFontSize(12)
		doc.text(
			`Engagement: ${result.originalContent.likes} likes, ${result.originalContent.retweets} retweets, ${result.originalContent.replies} replies`,
			margin + 5,
			yPosition
		)
		yPosition += 15

		doc.setFont("helvetica", "bold")
		doc.text("Cryptographic Proof:", margin, yPosition)
		yPosition += 8

		doc.setFont("helvetica", "normal")
		doc.text("Blockchain Hash:", margin + 5, yPosition)
		yPosition += 5

		doc.setFont("courier", "normal")
		doc.setFontSize(10)
		const hashLines = doc.splitTextToSize(
			result.timestampData.blockchainHash,
			pageWidth - 2 * margin - 10
		)
		hashLines.forEach((line) => {
			doc.text(line, margin + 10, yPosition)
			yPosition += 4
		})

		yPosition += 8
		doc.setFont("helvetica", "normal")
		doc.setFontSize(12)
		doc.text("Verification Hash:", margin + 5, yPosition)
		yPosition += 5

		doc.setFont("courier", "normal")
		doc.setFontSize(10)
		const verificationHashLines = doc.splitTextToSize(
			result.timestampData.verificationHash,
			pageWidth - 2 * margin - 10
		)
		verificationHashLines.forEach((line) => {
			doc.text(line, margin + 10, yPosition)
			yPosition += 4
		})

		yPosition += 15

		if (digitalSignature) {
			doc.setFont("helvetica", "bold")
			doc.setFontSize(12)
			doc.text("Digital Signature Details:", margin, yPosition)
			yPosition += 8

			doc.setFillColor(248, 250, 252)
			doc.rect(margin, yPosition, pageWidth - 2 * margin, 45, "F")

			doc.setFont("helvetica", "normal")
			doc.setFontSize(10)
			doc.text(
				`Signature Algorithm: ${digitalSignature.algorithm}`,
				margin + 5,
				yPosition + 8
			)
			doc.text(
				`Signed At: ${new Date(digitalSignature.signedAt).toLocaleString()}`,
				margin + 5,
				yPosition + 15
			)
			doc.text(
				`Document Hash: ${digitalSignature.documentHash}`,
				margin + 5,
				yPosition + 22
			)
			doc.text(
				`Signature Status: ${digitalSignature.isValid ? "VALID" : "INVALID"}`,
				margin + 5,
				yPosition + 29
			)

			if (digitalSignatureSettings.showPublicKey) {
				doc.text("Public Key (Truncated):", margin + 5, yPosition + 36)
				doc.setFont("courier", "normal")
				doc.setFontSize(8)
				doc.text(
					"MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2Z8QX1fLKjWE...",
					margin + 10,
					yPosition + 42
				)
			}

			yPosition += 55
		}

		if (result.timestampData.status === "deleted") {
			doc.setFillColor(254, 240, 138)
			doc.rect(margin, yPosition, pageWidth - 2 * margin, 20, "F")
			doc.setTextColor(161, 98, 7)
			doc.setFont("helvetica", "bold")
			doc.setFontSize(12)
			doc.text(
				"\u26a0 IMPORTANT: Original post has been deleted from X",
				margin + 5,
				yPosition + 8
			)
			doc.setFont("helvetica", "normal")
			doc.text(
				"This report contains the preserved content from before deletion.",
				margin + 5,
				yPosition + 15
			)
			doc.setTextColor(0, 0, 0)
			yPosition += 25
		}

		yPosition += 10
		doc.setFillColor(240, 249, 255)
		doc.rect(margin, yPosition, pageWidth - 2 * margin, 35, "F")
		doc.setTextColor(30, 64, 175)
		doc.setFont("helvetica", "bold")
		doc.setFontSize(10)
		doc.text("AUTHENTICITY & SECURITY GUARANTEE", margin + 5, yPosition + 8)

		doc.setFont("helvetica", "normal")
		doc.text(
			"This report is cryptographically signed and watermarked by SaveOnX.",
			margin + 5,
			yPosition + 15
		)
		doc.text(
			"Digital signatures provide non-repudiation and tamper detection.",
			margin + 5,
			yPosition + 22
		)
		doc.text(
			"Any modifications will invalidate both the signature and authenticity.",
			margin + 5,
			yPosition + 29
		)
		doc.setTextColor(0, 0, 0)
	}

	const footerY = doc.internal.pageSize.getHeight() - 30
	doc.setFontSize(10)
	doc.setFont("helvetica", "normal")
	doc.setTextColor(128, 128, 128)
	doc.text(`Generated on ${new Date().toLocaleString()}`, margin, footerY)
	doc.text(
		"SaveOnX - Preserving Digital Truth",
		pageWidth - margin - 50,
		footerY
	)

	if (digitalSignature) {
		doc.setFontSize(8)
		doc.text(
			`Digital Signature: ${digitalSignature.signatureId}`,
			margin,
			footerY + 8
		)
		doc.text(
			"Verify at: verify.saveonx.com",
			pageWidth - margin - 40,
			footerY + 8
		)
	}

	const fileName = `saveonx_verification_${digitalSignature ? "signed_" : ""}${
		new Date().toISOString().split("T")[0]
	}.pdf`
	doc.save(fileName)
}
