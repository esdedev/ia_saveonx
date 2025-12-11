"use client"

import { useCallback, useMemo, useState } from "react"
import { ContentContainer } from "@/features/shared/components"
import { useClipboard, usePostUrl } from "@/features/shared/hooks"
import { ConfirmationSection } from "@/features/timestamp/components/ConfirmationSection"
import { NetworkSelectionSection } from "@/features/timestamp/components/NetworkSelectionSection"
import { PostPreviewSection } from "@/features/timestamp/components/PostPreviewSection"
import { TimestampHeader } from "@/features/timestamp/components/TimestampHeader"
import { TimestampNavigation } from "@/features/timestamp/components/TimestampNavigation"
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

const INITIAL_SELECTED_NETWORKS = ["ethereum"] as const

const getDefaultSelectedNetworks = () => [...INITIAL_SELECTED_NETWORKS]

// TODO: Replace with actual user ID from auth
const DEMO_USER_ID = "demo-user-id"

export default function TimestampPage() {
	// URL management with validation
	const {
		url: postUrl,
		setUrl: setPostUrl,
		clear: clearUrl,
		error: urlError,
		validate: validateUrl
	} = usePostUrl()

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

		try {
			const response = await fetch(
				`/api/posts/preview?url=${encodeURIComponent(postUrl)}`
			)
			const data = await response.json()

			if (!response.ok) {
				setFetchError(data.error || "Failed to fetch post")
				setIsFetchingPost(false)
				return
			}

			// Transform API response to PostPreview format
			const preview: PostPreview = {
				author: data.post.authorDisplayName,
				handle: `@${data.post.authorUsername}`,
				content: data.post.content,
				timestamp: data.post.postedAt,
				likes: data.post.likes,
				retweets: data.post.retweets,
				replies: data.post.replies,
				profileImage: data.post.authorProfileImage
			}

			setPostPreview(preview)
			setStep("preview")
		} catch {
			setFetchError("Failed to fetch post. Please try again.")
		} finally {
			setIsFetchingPost(false)
		}
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
		if (selectedNetworkIds.length === 0) {
			return
		}

		setIsSubmitting(true)
		setFetchError("")

		try {
			// Submit timestamp for each selected network
			// For now, we'll use the first network (in production, could batch these)
			const blockchain = selectedNetworkIds[0]

			const response = await fetch("/api/timestamps", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					userId: DEMO_USER_ID,
					postUrl,
					blockchain
				})
			})

			const data = await response.json()

			if (!response.ok) {
				setFetchError(data.error || "Failed to create timestamp")
				setIsSubmitting(false)
				return
			}

			setSubmissionResult({
				transactionId: data.timestamp.id,
				hash: data.timestamp.transactionHash || "pending"
			})
		} catch {
			setFetchError("Failed to create timestamp. Please try again.")
		} finally {
			setIsSubmitting(false)
		}
	}, [postUrl, selectedNetworkIds])

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

	return (
		<div className="min-h-screen bg-black text-white">
			<TimestampNavigation />
			<ContentContainer maxWidth="4xl" className="py-12">
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
