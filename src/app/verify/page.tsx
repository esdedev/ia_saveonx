"use client"

import { useCallback, useState } from "react"
import { PageLayout } from "@/features/shared/components"
import { useClipboard, usePostUrl } from "@/features/shared/hooks"
import { CallToActionCard } from "@/features/verify/components/CallToActionCard"
import { CryptographicProofCard } from "@/features/verify/components/CryptographicProofCard"
import { OriginalPostCard } from "@/features/verify/components/OriginalPostCard"
import { PostSearchCard } from "@/features/verify/components/PostSearchCard"
import { VerificationStatusCard } from "@/features/verify/components/VerificationStatusCard"
import { VerifyHeader } from "@/features/verify/components/VerifyHeader"
import type {
	DigitalSignatureSettings,
	VerificationResult,
	WatermarkSettings
} from "@/features/verify/types"
import { exportVerificationReport } from "@/features/verify/utils/pdf"

const INITIAL_WATERMARK_SETTINGS: WatermarkSettings = {
	enabled: true,
	text: "VERIFIED BY SAVEONX",
	opacity: 0.1,
	position: "diagonal",
	customText: "",
	useCustom: false
}

const INITIAL_SIGNATURE_SETTINGS: DigitalSignatureSettings = {
	enabled: true,
	algorithm: "RSA-SHA256",
	includeTimestamp: true,
	showPublicKey: true,
	signatureLevel: "advanced"
}

const createMockResult = (postUrl: string): VerificationResult => ({
	isTimestamped: true,
	postUrl,
	originalContent: {
		author: "Tech Innovator",
		handle: "@techinnovator",
		content:
			"Just announced our revolutionary AI breakthrough that will change everything! This technology will transform how we interact with digital content. #AI #Innovation #TechNews",
		timestamp: "2024-01-15T14:30:00Z",
		likes: 1247,
		retweets: 389,
		replies: 156
	},
	timestampData: {
		timestampedAt: "2024-01-15T14:31:23Z",
		blockchainHash:
			"0x7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730",
		verificationHash:
			"sha256:a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
		status: "deleted"
	}
})

export default function VerifyPage() {
	// URL management with validation
	const {
		url: postUrl,
		setUrl: setPostUrl,
		error: urlError,
		validate: validateUrl
	} = usePostUrl()

	// Clipboard with success feedback
	const { copy } = useClipboard()

	const [isSearching, setIsSearching] = useState(false)
	const [result, setResult] = useState<VerificationResult | null>(null)
	const [searchError, setSearchError] = useState("")
	const [watermarkSettings, setWatermarkSettings] = useState<WatermarkSettings>(
		INITIAL_WATERMARK_SETTINGS
	)
	const [digitalSignatureSettings, setDigitalSignatureSettings] =
		useState<DigitalSignatureSettings>(INITIAL_SIGNATURE_SETTINGS)
	const [showWatermarkSettings, setShowWatermarkSettings] = useState(false)
	const [showSignatureSettings, setShowSignatureSettings] = useState(false)

	// Combined error from URL validation or search
	const error = urlError || searchError

	const resetPanelVisibility = useCallback(() => {
		setShowSignatureSettings(false)
		setShowWatermarkSettings(false)
	}, [])

	const handlePostUrlChange = useCallback(
		(value: string) => {
			setPostUrl(value)
			setSearchError("") // Clear search error when typing
		},
		[setPostUrl]
	)

	const handleVerify = useCallback(() => {
		if (!validateUrl()) {
			return
		}

		setIsSearching(true)
		setSearchError("")
		resetPanelVisibility()
		setResult(null)

		setTimeout(() => {
			setResult(createMockResult(postUrl))
			setIsSearching(false)
		}, 2000)
	}, [postUrl, resetPanelVisibility, validateUrl])

	const handleCopy = useCallback(
		(value: string) => {
			void copy(value)
		},
		[copy]
	)

	const handleExport = useCallback(() => {
		if (!result) {
			return
		}

		exportVerificationReport({
			result,
			watermarkSettings,
			digitalSignatureSettings
		})
	}, [result, watermarkSettings, digitalSignatureSettings])

	const handleOpenPost = useCallback(() => {
		if (!result) {
			return
		}

		if (typeof window !== "undefined") {
			window.open(result.postUrl, "_blank", "noopener")
		}
	}, [result])

	const handleDigitalSignatureSettingsChange = useCallback(
		(settings: DigitalSignatureSettings) => {
			setDigitalSignatureSettings(settings)
		},
		[]
	)

	const handleWatermarkSettingsChange = useCallback(
		(settings: WatermarkSettings) => {
			setWatermarkSettings(settings)
		},
		[]
	)

	const toggleSignatureSettings = useCallback(() => {
		setShowSignatureSettings((previous) => !previous)
	}, [])

	const toggleWatermarkSettings = useCallback(() => {
		setShowWatermarkSettings((previous) => !previous)
	}, [])

	return (
		<PageLayout maxWidth="6xl" paddingY="12">
			<VerifyHeader />
			<PostSearchCard
				postUrl={postUrl}
				error={error}
				isSearching={isSearching}
				onPostUrlChange={handlePostUrlChange}
				onVerify={handleVerify}
			/>
			{result && (
				<div className="space-y-6">
					<VerificationStatusCard
						result={result}
						digitalSignatureSettings={digitalSignatureSettings}
						watermarkSettings={watermarkSettings}
						showSignatureSettings={showSignatureSettings}
						showWatermarkSettings={showWatermarkSettings}
						onToggleSignatureSettings={toggleSignatureSettings}
						onToggleWatermarkSettings={toggleWatermarkSettings}
						onDigitalSignatureSettingsChange={
							handleDigitalSignatureSettingsChange
						}
						onWatermarkSettingsChange={handleWatermarkSettingsChange}
						onExport={handleExport}
						onOpenPost={handleOpenPost}
					/>
					{result.isTimestamped && (
						<>
							<OriginalPostCard result={result} />
							<CryptographicProofCard
								result={result}
								onCopy={handleCopy}
								onExport={handleExport}
							/>
						</>
					)}
				</div>
			)}
			<CallToActionCard />
		</PageLayout>
	)
}
