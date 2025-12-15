"use client"

import { useCallback, useState } from "react"
import { PageLayout } from "@/features/shared/components/PageLayout"
import { useClipboard } from "@/features/shared/hooks/useClipboard"
import { usePostUrl } from "@/features/shared/hooks/usePostUrl"
import { verifyPostAction } from "@/features/verify/actions/verify"
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

// Helper to transform API response to VerificationResult
function transformApiResponse(
	apiResponse: {
		isTimestamped: boolean
		timestampData?: {
			id: string
			blockchain: string
			transactionHash: string | null
			blockNumber: number | null
			explorerUrl: string | null
			timestampedAt: string
			status: "verified" | "modified" | "deleted"
		}
		postData?: {
			content: string
			authorUsername: string
			authorDisplayName: string | null
			postedAt: string | null
			likesAtCapture: number | null
			retweetsAtCapture: number | null
			repliesAtCapture: number | null
		}
		error?: string
	},
	postUrl: string
): VerificationResult {
	if (
		!apiResponse.isTimestamped ||
		!apiResponse.timestampData ||
		!apiResponse.postData
	) {
		return {
			isTimestamped: false,
			postUrl,
			originalContent: {
				author: "",
				handle: "",
				content: "",
				timestamp: "",
				likes: 0,
				retweets: 0,
				replies: 0
			},
			timestampData: {
				timestampedAt: "",
				blockchainHash: "",
				verificationHash: "",
				status: "verified"
			}
		}
	}

	return {
		isTimestamped: true,
		postUrl,
		originalContent: {
			author:
				apiResponse.postData.authorDisplayName ||
				apiResponse.postData.authorUsername,
			handle: `@${apiResponse.postData.authorUsername}`,
			content: apiResponse.postData.content,
			timestamp: apiResponse.postData.postedAt || "",
			likes: apiResponse.postData.likesAtCapture || 0,
			retweets: apiResponse.postData.retweetsAtCapture || 0,
			replies: apiResponse.postData.repliesAtCapture || 0
		},
		timestampData: {
			timestampedAt: apiResponse.timestampData.timestampedAt,
			blockchainHash: apiResponse.timestampData.transactionHash || "",
			verificationHash: `sha256:${apiResponse.timestampData.id}`,
			status: apiResponse.timestampData.status
		}
	}
}

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

	const handleVerify = useCallback(async () => {
		if (!validateUrl()) {
			return
		}

		setIsSearching(true)
		setSearchError("")
		resetPanelVisibility()
		setResult(null)

		const response = await verifyPostAction({ postUrl })

		if (!response.success) {
			setSearchError(response.error)
			setIsSearching(false)
			return
		}

		setResult(transformApiResponse(response.data, postUrl))
		setIsSearching(false)
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
