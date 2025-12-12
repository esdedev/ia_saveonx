"use client"

import { CheckCircle, Loader2, Save } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	getUserProfile,
	type UserProfile,
	updateUserProfile
} from "@/features/dashboard/settings/actions/settings"
import { StatusBadge } from "@/features/shared/components/StatusBadge"

interface ProfileSettingsSectionProps {
	initialProfile?: UserProfile | null
}

export function ProfileSettingsSection({
	initialProfile
}: ProfileSettingsSectionProps) {
	const [profile, setProfile] = useState<UserProfile | null>(
		initialProfile ?? null
	)
	const [isLoading, setIsLoading] = useState(!initialProfile)
	const [isSaving, setIsSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [saveSuccess, setSaveSuccess] = useState(false)

	// Form state
	const [name, setName] = useState(initialProfile?.name ?? "")

	useEffect(() => {
		async function fetchProfile() {
			setIsLoading(true)
			setError(null)
			const result = await getUserProfile()
			if (result.success) {
				setProfile(result.data)
			} else {
				setError(result.error)
			}
			setIsLoading(false)
		}

		if (!initialProfile) {
			fetchProfile()
		}
	}, [initialProfile])

	useEffect(() => {
		if (profile) {
			setName(profile.name)
		}
	}, [profile])

	async function handleSave() {
		setIsSaving(true)
		setSaveSuccess(false)
		setError(null)

		const result = await updateUserProfile({ name })
		if (result.success) {
			setProfile(result.data)
			setSaveSuccess(true)
			setTimeout(() => setSaveSuccess(false), 3000)
		} else {
			setError(result.error)
		}
		setIsSaving(false)
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="h-8 w-8 animate-spin text-blue-500" />
			</div>
		)
	}

	if (error && !profile) {
		return (
			<Card className="bg-red-900/20 border-red-700">
				<CardContent className="py-8 text-center">
					<p className="text-red-400">{error}</p>
					<Button
						variant="outline"
						className="mt-4 border-red-600 text-red-400"
						onClick={loadProfile}
					>
						Try Again
					</Button>
				</CardContent>
			</Card>
		)
	}

	const tierLabel =
		{
			free: "Free",
			pro: "Professional",
			enterprise: "Enterprise"
		}[profile?.subscriptionTier ?? "free"] ?? "Free"

	const memberSince = profile?.createdAt
		? new Date(profile.createdAt).toLocaleDateString("en-US", {
				month: "long",
				year: "numeric"
			})
		: "Unknown"

	return (
		<div className="space-y-6">
			<Card className="bg-gray-900/50 border-gray-700">
				<CardHeader>
					<CardTitle className="text-white">Profile Information</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<Label htmlFor="name" className="text-gray-300">
							Name
						</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="bg-gray-800 border-gray-600 text-white"
						/>
					</div>
					<div>
						<Label htmlFor="email" className="text-gray-300">
							Email Address
						</Label>
						<Input
							id="email"
							type="email"
							value={profile?.email ?? ""}
							disabled
							className="bg-gray-800 border-gray-600 text-gray-400"
						/>
						<p className="text-xs text-gray-500 mt-1">
							Email cannot be changed. Contact support if needed.
						</p>
					</div>
					{profile?.xUsername && (
						<div>
							<Label htmlFor="xUsername" className="text-gray-300">
								X/Twitter Username
							</Label>
							<Input
								id="xUsername"
								value={`@${profile.xUsername}`}
								disabled
								className="bg-gray-800 border-gray-600 text-gray-400"
							/>
						</div>
					)}

					{error && <p className="text-sm text-red-400">{error}</p>}
					{saveSuccess && (
						<p className="text-sm text-green-400">
							Profile saved successfully!
						</p>
					)}

					<Button
						className="bg-blue-500 hover:bg-blue-600 text-white"
						onClick={handleSave}
						disabled={isSaving}
					>
						{isSaving ? (
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
						) : (
							<Save className="h-4 w-4 mr-2" />
						)}
						Save Changes
					</Button>
				</CardContent>
			</Card>

			<Card className="bg-gray-900/50 border-gray-700">
				<CardHeader>
					<CardTitle className="text-white">Account Status</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between">
						<div>
							<div className="flex items-center space-x-2 mb-2">
								<StatusBadge label={tierLabel} variant="success" />
								{profile?.emailVerified && (
									<CheckCircle className="h-4 w-4 text-green-400" />
								)}
							</div>
							<p className="text-gray-300">
								{profile?.emailVerified
									? "Account verified and active"
									: "Email not verified"}
							</p>
							<p className="text-sm text-gray-400">
								Member since {memberSince}
							</p>
						</div>
						{profile?.subscriptionTier === "free" && (
							<Button
								variant="outline"
								className="border-gray-600 text-gray-300"
							>
								Upgrade Plan
							</Button>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
