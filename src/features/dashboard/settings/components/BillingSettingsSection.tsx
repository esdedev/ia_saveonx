"use client"

import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
	type BillingInfo,
	getBillingInfo
} from "@/features/dashboard/settings/actions/settings"
import { StatusBadge } from "@/features/shared/components/StatusBadge"

interface BillingSettingsSectionProps {
	initialBillingInfo?: BillingInfo | null
}

const TIER_DETAILS: Record<
	string,
	{ name: string; price: string; limit: string }
> = {
	free: { name: "Free Plan", price: "$0", limit: "10 timestamps per month" },
	pro: {
		name: "Professional Plan",
		price: "$29",
		limit: "1,000 timestamps per month"
	},
	enterprise: {
		name: "Enterprise Plan",
		price: "$99",
		limit: "Unlimited timestamps"
	}
}

export function BillingSettingsSection({
	initialBillingInfo
}: BillingSettingsSectionProps) {
	const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(
		initialBillingInfo ?? null
	)
	const [isLoading, setIsLoading] = useState(!initialBillingInfo)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function fetchBillingInfo() {
			setIsLoading(true)
			setError(null)
			const result = await getBillingInfo()
			if (result.success) {
				setBillingInfo(result.data)
			} else {
				setError(result.error)
			}
			setIsLoading(false)
		}

		if (!initialBillingInfo) {
			fetchBillingInfo()
		}
	}, [initialBillingInfo])

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="h-8 w-8 animate-spin text-blue-500" />
			</div>
		)
	}

	if (error && !billingInfo) {
		return (
			<Card className="bg-red-900/20 border-red-700">
				<CardContent className="py-8 text-center">
					<p className="text-red-400">{error}</p>
				</CardContent>
			</Card>
		)
	}

	const tierInfo =
		TIER_DETAILS[billingInfo?.tier ?? "free"] ?? TIER_DETAILS.free

	return (
		<div className="space-y-6">
			<Card className="bg-gray-900/50 border-gray-700">
				<CardHeader>
					<CardTitle className="text-white">Current Plan</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between mb-6">
						<div>
							<h3 className="text-xl font-bold text-white">{tierInfo.name}</h3>
							<p className="text-gray-400">{tierInfo.limit}</p>
							<p className="text-2xl font-bold text-white mt-2">
								{tierInfo.price}
								{billingInfo?.tier !== "free" && (
									<span className="text-lg text-gray-400">/month</span>
								)}
							</p>
						</div>
						<StatusBadge label="Active" variant="info" />
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<div className="bg-gray-800/50 rounded-lg p-4">
							<div className="text-2xl font-bold text-white">
								{billingInfo?.timestampsUsedThisMonth ?? 0}
							</div>
							<div className="text-sm text-gray-400">Timestamps Used</div>
						</div>
						<div className="bg-gray-800/50 rounded-lg p-4">
							<div className="text-2xl font-bold text-white">
								{billingInfo?.remaining ?? 0}
							</div>
							<div className="text-sm text-gray-400">Remaining</div>
						</div>
						<div className="bg-gray-800/50 rounded-lg p-4">
							<div className="text-2xl font-bold text-white">
								{billingInfo?.daysLeftInMonth ?? 0}
							</div>
							<div className="text-sm text-gray-400">Days Left</div>
						</div>
					</div>
					<div className="flex space-x-4">
						{billingInfo?.tier === "free" && (
							<Button className="bg-blue-500 hover:bg-blue-600 text-white">
								Upgrade to Pro
							</Button>
						)}
						{billingInfo?.tier === "pro" && (
							<>
								<Button
									variant="outline"
									className="border-gray-600 text-gray-300"
								>
									Change Plan
								</Button>
								<Button
									variant="outline"
									className="border-red-600 text-red-400"
								>
									Cancel Subscription
								</Button>
							</>
						)}
					</div>
				</CardContent>
			</Card>

			{billingInfo?.tier !== "free" && (
				<Card className="bg-gray-900/50 border-gray-700">
					<CardHeader>
						<CardTitle className="text-white">Payment Method</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-between mb-4">
							<div className="text-gray-400">
								<p>
									Payment methods will be available when you upgrade to a paid
									plan.
								</p>
							</div>
							<Button
								variant="outline"
								size="sm"
								className="border-gray-600 text-gray-300"
							>
								Add Payment Method
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			<Card className="bg-gray-900/50 border-gray-700">
				<CardHeader>
					<CardTitle className="text-white">Billing History</CardTitle>
				</CardHeader>
				<CardContent>
					{billingInfo?.tier === "free" ? (
						<p className="text-gray-400">
							No billing history yet. Upgrade to a paid plan to see invoices
							here.
						</p>
					) : (
						<div className="space-y-3">
							<p className="text-gray-400">
								Billing history will appear here after your first payment.
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
