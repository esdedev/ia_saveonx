"use client"

import { Check, Copy, Key, Loader2, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	type ApiKeyInfo,
	type ApiUsageStats,
	createApiKey,
	getApiKeys,
	getApiUsageStats,
	revokeApiKey
} from "@/features/dashboard/settings/actions/settings"

export function ApiSettingsSection() {
	const [apiKeys, setApiKeys] = useState<ApiKeyInfo[]>([])
	const [usageStats, setUsageStats] = useState<ApiUsageStats | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// New key creation
	const [isCreating, setIsCreating] = useState(false)
	const [newKeyName, setNewKeyName] = useState("")
	const [showNewKeyForm, setShowNewKeyForm] = useState(false)
	const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null)
	const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null)

	// Revocation
	const [revokingKeyId, setRevokingKeyId] = useState<string | null>(null)

	useEffect(() => {
		async function loadData() {
			setIsLoading(true)
			setError(null)

			const [keysResult, usageResult] = await Promise.all([
				getApiKeys(),
				getApiUsageStats()
			])

			if (keysResult.success) {
				setApiKeys(keysResult.data)
			} else {
				setError(keysResult.error)
			}

			if (usageResult.success) {
				setUsageStats(usageResult.data)
			}

			setIsLoading(false)
		}

		loadData()
	}, [])

	async function handleCreateKey() {
		if (!newKeyName.trim()) {
			setError("Please enter a name for the API key")
			return
		}

		setIsCreating(true)
		setError(null)

		const result = await createApiKey(newKeyName)
		if (result.success) {
			setApiKeys((prev) => [...prev, result.data.info])
			setNewlyCreatedKey(result.data.key)
			setNewKeyName("")
			setShowNewKeyForm(false)
		} else {
			setError(result.error)
		}
		setIsCreating(false)
	}

	async function handleRevokeKey(keyId: string) {
		setRevokingKeyId(keyId)
		setError(null)

		const result = await revokeApiKey(keyId)
		if (result.success) {
			setApiKeys((prev) => prev.filter((k) => k.id !== keyId))
		} else {
			setError(result.error)
		}
		setRevokingKeyId(null)
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="h-8 w-8 animate-spin text-blue-500" />
			</div>
		)
	}

	return (
		<div className="space-y-6">
			<Card className="bg-gray-900/50 border-gray-700">
				<CardHeader>
					<CardTitle className="text-white">API Keys</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
						<div className="flex items-center space-x-2 mb-2">
							<Key className="h-4 w-4 text-blue-400" />
							<span className="font-medium text-blue-400">API Access</span>
						</div>
						<p className="text-sm text-gray-300">
							Use our API to integrate SaveOnX timestamping into your
							applications.
						</p>
					</div>

					{newlyCreatedKey && (
						<div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
							<p className="text-green-400 font-medium mb-2">
								New API Key Created
							</p>
							<p className="text-sm text-gray-300 mb-2">
								Copy this key now. You won't be able to see it again!
							</p>
							<div className="flex items-center gap-2">
								<code className="flex-1 bg-gray-800 px-3 py-2 rounded text-sm text-white font-mono break-all">
									{newlyCreatedKey}
								</code>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => {
										navigator.clipboard.writeText(newlyCreatedKey)
										setCopiedKeyId("new")
									}}
								>
									{copiedKeyId === "new" ? (
										<Check className="h-4 w-4 text-green-400" />
									) : (
										<Copy className="h-4 w-4" />
									)}
								</Button>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="mt-2 text-gray-400"
								onClick={() => setNewlyCreatedKey(null)}
							>
								Dismiss
							</Button>
						</div>
					)}

					{error && <p className="text-sm text-red-400">{error}</p>}

					<div className="space-y-3">
						{apiKeys.length === 0 ? (
							<p className="text-gray-400 text-center py-4">
								No API keys yet. Create one to get started.
							</p>
						) : (
							apiKeys.map((apiKey) => (
								<div
									key={apiKey.id}
									className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
								>
									<div>
										<div className="font-medium text-white">{apiKey.name}</div>
										<div className="text-sm text-gray-400 font-mono">
											{apiKey.keyPrefix}••••••••••••••••••••••••
										</div>
										<div className="text-xs text-gray-500 mt-1">
											Created{" "}
											{new Date(apiKey.createdAt).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric"
											})}
											{apiKey.usageCount > 0 && (
												<> • {apiKey.usageCount} uses</>
											)}
										</div>
									</div>
									<div className="flex items-center space-x-2">
										<Button
											variant="ghost"
											size="sm"
											className="text-red-400 hover:text-red-300"
											onClick={() => handleRevokeKey(apiKey.id)}
											disabled={revokingKeyId === apiKey.id}
										>
											{revokingKeyId === apiKey.id ? (
												<Loader2 className="h-4 w-4 animate-spin" />
											) : (
												<Trash2 className="h-4 w-4" />
											)}
											Revoke
										</Button>
									</div>
								</div>
							))
						)}
					</div>

					{showNewKeyForm ? (
						<div className="space-y-3 bg-gray-800/50 p-4 rounded-lg">
							<div>
								<Label htmlFor="keyName" className="text-gray-300">
									Key Name
								</Label>
								<Input
									id="keyName"
									value={newKeyName}
									onChange={(e) => setNewKeyName(e.target.value)}
									placeholder="e.g., Production Key"
									className="bg-gray-800 border-gray-600 text-white mt-1"
								/>
							</div>
							<div className="flex space-x-2">
								<Button
									variant="outline"
									className="border-gray-600 text-gray-300"
									onClick={() => {
										setShowNewKeyForm(false)
										setNewKeyName("")
									}}
								>
									Cancel
								</Button>
								<Button
									className="bg-blue-500 hover:bg-blue-600 text-white"
									onClick={handleCreateKey}
									disabled={isCreating}
								>
									{isCreating && (
										<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									)}
									Create Key
								</Button>
							</div>
						</div>
					) : (
						<Button
							className="bg-blue-500 hover:bg-blue-600 text-white"
							onClick={() => setShowNewKeyForm(true)}
						>
							<Key className="h-4 w-4 mr-2" />
							Generate New Key
						</Button>
					)}
				</CardContent>
			</Card>

			<Card className="bg-gray-900/50 border-gray-700">
				<CardHeader>
					<CardTitle className="text-white">API Usage</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="bg-gray-800/50 rounded-lg p-4">
							<div className="text-2xl font-bold text-white">
								{usageStats?.callsThisMonth.toLocaleString() ?? 0}
							</div>
							<div className="text-sm text-gray-400">API Calls This Month</div>
						</div>
						<div className="bg-gray-800/50 rounded-lg p-4">
							<div className="text-2xl font-bold text-white">
								{usageStats?.remainingCalls.toLocaleString() ?? 0}
							</div>
							<div className="text-sm text-gray-400">Remaining Calls</div>
						</div>
						<div className="bg-gray-800/50 rounded-lg p-4">
							<div className="text-2xl font-bold text-white">
								{usageStats?.uptime ?? 99.9}%
							</div>
							<div className="text-sm text-gray-400">Uptime</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
