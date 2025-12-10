export interface VerificationResult {
	isTimestamped: boolean
	postUrl: string
	originalContent: {
		author: string
		handle: string
		content: string
		timestamp: string
		likes: number
		retweets: number
		replies: number
	}
	timestampData: {
		timestampedAt: string
		blockchainHash: string
		verificationHash: string
		status: "verified" | "deleted" | "modified"
	}
}

export interface DigitalSignature {
	signatureId: string
	publicKey: string
	privateKeyHash: string
	algorithm: "RSA-SHA256" | "ECDSA-SHA256" | "EdDSA"
	signedAt: string
	documentHash: string
	isValid: boolean
}

export interface DigitalSignatureSettings {
	enabled: boolean
	algorithm: "RSA-SHA256" | "ECDSA-SHA256" | "EdDSA"
	includeTimestamp: boolean
	showPublicKey: boolean
	signatureLevel: "basic" | "advanced" | "qualified"
}

export interface WatermarkSettings {
	enabled: boolean
	text: string
	opacity: number
	position: "diagonal" | "background" | "footer"
	customText: string
	useCustom: boolean
}
