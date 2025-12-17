"use client"

import { useSearchParams } from "next/navigation"
import { useCallback, useMemo, useState } from "react"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { ContentContainer } from "@/features/shared/components/PageLayout"
import { useClipboard } from "@/features/shared/hooks/useClipboard"
import { usePostUrl } from "@/features/shared/hooks/usePostUrl"
import {
	fetchPostPreview
} from "@/features/timestamp/actions/timestamp"
import { ConfirmationSection } from "@/features/timestamp/components/ConfirmationSection"
import { NetworkSelectionSection } from "@/features/timestamp/components/NetworkSelectionSection"
import { PostPreviewSection } from "@/features/timestamp/components/PostPreviewSection"
import { TimestampHeader } from "@/features/timestamp/components/TimestampHeader"
import { TimestampProgress } from "@/features/timestamp/components/TimestampProgress"
import { UrlInputCard } from "@/features/timestamp/components/UrlInputCard"
import type {
	PostPreview,
	SubmissionResult,
	TimestampStep
} from "@/features/timestamp/types"
import {
	BLOCKCHAIN_OPTIONS,
	calculateTotalCost
} from "@/features/timestamp/utils/blockchain"

// Default to Bitcoin (OpenTimestamps) - free and most secure
const INITIAL_SELECTED_NETWORKS = ["bitcoin-ots"] as const

const getDefaultSelectedNetworks = () => [...INITIAL_SELECTED_NETWORKS]

export default function TimestampPage() {
	// Get authenticated user
	const { user, isLoading } = useAuth()

	const searchParams = useSearchParams()

	const post = searchParams.get("post") || ""

	// URL management with validation
	const {
		url: postUrl,
		setUrl: setPostUrl,
		clear: clearUrl,
		error: urlError,
		validate: validateUrl
	} = usePostUrl({ initialValue: post })

	// Clipboard
	const { copy } = useClipboard()

	const [step, setStep] = useState<TimestampStep>("input")
	const [fetchError, setFetchError] = useState("")
	const [isFetchingPost, setIsFetchingPost] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [postPreview, setPostPreview] = useState<PostPreview | null>(null)
	const [selectedNetworkIds, setSelectedNetworkIds] = useState<string[]>(() =>
		getDefaultSelectedNetworks()
	)
	const [submissionResult, setSubmissionResult] =
		useState<SubmissionResult | null>(null)

	// Combined error
	const error = urlError || fetchError

	const totalCost = useMemo(
		() => calculateTotalCost(selectedNetworkIds, BLOCKCHAIN_OPTIONS),
		[selectedNetworkIds]
	)

	const handlePostUrlChange = useCallback(
		(value: string) => {
			setPostUrl(value)
			setFetchError("")
		},
		[setPostUrl]
	)

	const handleFetchPost = useCallback(async () => {
		if (!validateUrl()) {
			return
		}

		setIsFetchingPost(true)
		setFetchError("")
		setSubmissionResult(null)
		setSelectedNetworkIds(getDefaultSelectedNetworks())

		const result = await fetchPostPreview(postUrl)

		if (!result.success) {
			setFetchError(result.error)
			setIsFetchingPost(false)
			return
		}

		// Transform action response to PostPreview format
		const preview: PostPreview = {
			author: result.data.authorDisplayName,
			handle: `@${result.data.authorUsername}`,
			content: result.data.content,
			timestamp: result.data.postedAt ?? "",
			likes: result.data.likes,
			retweets: result.data.retweets,
			replies: result.data.replies,
			profileImage: result.data.authorProfileImage ?? undefined
		}

		setPostPreview(preview)
		setStep("preview")
		setIsFetchingPost(false)
	}, [postUrl, validateUrl])

	const resetToInput = useCallback(() => {
		setStep("input")
		setPostPreview(null)
		clearUrl()
		setFetchError("")
	}, [clearUrl])

	const handleToggleNetwork = useCallback((networkId: string) => {
		setSelectedNetworkIds((previous) =>
			previous.includes(networkId)
				? previous.filter((id) => id !== networkId)
				: [...previous, networkId]
		)
	}, [])

	const handleSubmit = useCallback(async () => {
		if (selectedNetworkIds.length === 0 || !user?.id) {
			return
		}

		setIsSubmitting(true)
		setFetchError("")

		// Submit timestamp for each selected network
		// For now, we'll use the first network (in production, could batch these)
		const blockchain = selectedNetworkIds[0]

		const result = await createTimestampAction({
			userId: user.id,
			postUrl,
			blockchain
		})

		if (!result.success) {
			setFetchError(result.error)
			setIsSubmitting(false)
			return
		}

		setSubmissionResult({
			transactionId: result.data.timestampId,
			hash: result.data.transactionHash || "pending"
		})
		setIsSubmitting(false)
	}, [postUrl, selectedNetworkIds, user?.id])

	const handleResetFlow = useCallback(() => {
		clearUrl()
		setStep("input")
		setFetchError("")
		setPostPreview(null)
		setSelectedNetworkIds(getDefaultSelectedNetworks())
		setSubmissionResult(null)
		setIsFetchingPost(false)
		setIsSubmitting(false)
	}, [clearUrl])

	const handleGoToDashboard = useCallback(() => {
		if (typeof window !== "undefined") {
			window.location.href = "/dashboard"
		}
	}, [])

	const handleCopy = useCallback(
		(value: string) => {
			void copy(value)
		},
		[copy]
	)

	// Show loading state while checking authentication
	if (isLoading) {
		return (
			<div className="py-12">
				<ContentContainer maxWidth="4xl">
					<div className="flex items-center justify-center py-20">
						<div className="text-gray-400">Loading...</div>
					</div>
				</ContentContainer>
			</div>
		)
	}

	// This should never happen due to middleware, but just in case
	if (!user) {
		return (
			<div className="py-12">
				<ContentContainer maxWidth="4xl">
					<div className="flex items-center justify-center py-20">
						<div className="text-red-400">Please log in to continue</div>
					</div>
				</ContentContainer>
			</div>
		)
	}

	return (
		<div className="py-12">
			<ContentContainer maxWidth="4xl">
				<TimestampHeader />
				<TimestampProgress step={step} />

				{step === "input" && (
					<UrlInputCard
						postUrl={postUrl}
						error={error}
						isLoading={isFetchingPost}
						onPostUrlChange={handlePostUrlChange}
						onSubmit={handleFetchPost}
					/>
				)}

				{step === "preview" && postPreview && (
					<PostPreviewSection
						postPreview={postPreview}
						onBack={resetToInput}
						onNext={() => setStep("networks")}
					/>
				)}

				{step === "networks" && postPreview && (
					<NetworkSelectionSection
						options={BLOCKCHAIN_OPTIONS}
						selectedNetworkIds={selectedNetworkIds}
						onToggleNetwork={handleToggleNetwork}
						onBack={() => setStep("preview")}
						onNext={() => setStep("confirmation")}
						totalCost={totalCost}
					/>
				)}

				{step === "confirmation" && postPreview && (
					<ConfirmationSection
						postPreview={postPreview}
						selectedNetworkIds={selectedNetworkIds}
						options={BLOCKCHAIN_OPTIONS}
						totalCost={totalCost}
						isSubmitting={isSubmitting}
						submissionResult={submissionResult}
						onSubmit={handleSubmit}
						onBack={() => setStep("networks")}
						onReset={handleResetFlow}
						onGoToDashboard={handleGoToDashboard}
						onCopy={handleCopy}
					/>
				)}
			</ContentContainer>
		</div>
	)
}

// TODO: Remove duplicate function (also in actions/timestamp.ts)
function createTimestampAction() {
	console.log("Function not implemented.")
}
