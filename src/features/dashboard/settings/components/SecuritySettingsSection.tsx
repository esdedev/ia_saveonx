"use client"

import { AlertTriangle, Download, Loader2, Trash2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	deleteUserAccount,
	exportUserData
} from "@/features/dashboard/settings/actions/settings"

export function SecuritySettingsSection() {
	const [isExporting, setIsExporting] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [exportResult, setExportResult] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
	const [deleteConfirmText, setDeleteConfirmText] = useState("")

	async function handleExport() {
		setIsExporting(true)
		setError(null)
		setExportResult(null)

		const result = await exportUserData()
		if (result.success) {
			// Create a downloadable JSON file
			const data = result.data
			const blob = new Blob([JSON.stringify(data, null, 2)], {
				type: "application/json"
			})
			const url = URL.createObjectURL(blob)
			const a = document.createElement("a")
			a.href = url
			a.download = `saveonx-data-export-${new Date().toISOString().split("T")[0]}.json`
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			URL.revokeObjectURL(url)
			setExportResult(
				`Exported: ${data.timestamps} timestamps, ${data.verifications} verifications, ${data.apiKeys} API keys`
			)
		} else {
			setError(result.error)
		}
		setIsExporting(false)
	}

	async function handleDelete() {
		if (deleteConfirmText !== "DELETE") {
			setError("Please type DELETE to confirm")
			return
		}

		setIsDeleting(true)
		setError(null)

		const result = await deleteUserAccount()
		if (result.success) {
			// Redirect to home after deletion
			window.location.href = "/"
		} else {
			setError(result.error)
			setIsDeleting(false)
		}
	}

	return (
		<div className="space-y-6">
			<Card className="bg-gray-900/50 border-gray-700">
				<CardHeader>
					<CardTitle className="text-white">Password</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-gray-400 text-sm">
						Password management is handled through your authentication provider.
						If you signed up with email, you can request a password reset.
					</p>
					<Button variant="outline" className="border-gray-600 text-gray-300">
						Request Password Reset
					</Button>
				</CardContent>
			</Card>

			<Card className="bg-gray-900/50 border-gray-700">
				<CardHeader>
					<CardTitle className="text-white">
						Two-Factor Authentication
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-300">
								Add an extra layer of security to your account
							</p>
							<p className="text-sm text-gray-400 mt-1">Status: Not enabled</p>
						</div>
						<Button
							variant="outline"
							className="border-blue-500/50 text-blue-400"
						>
							Enable 2FA
						</Button>
					</div>
				</CardContent>
			</Card>

			<Card className="bg-gray-900/50 border-gray-700">
				<CardHeader>
					<CardTitle className="text-white flex items-center space-x-2">
						<AlertTriangle className="h-5 w-5 text-red-400" />
						<span>Danger Zone</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-300">Export your data</p>
								<p className="text-sm text-gray-400">
									Download all your timestamps and verification data
								</p>
								{exportResult && (
									<p className="text-sm text-green-400 mt-1">{exportResult}</p>
								)}
							</div>
							<Button
								variant="outline"
								className="border-gray-600 text-gray-300"
								onClick={handleExport}
								disabled={isExporting}
							>
								{isExporting ? (
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								) : (
									<Download className="h-4 w-4 mr-2" />
								)}
								Export Data
							</Button>
						</div>

						<div className="border-t border-gray-700 pt-4">
							{!showDeleteConfirm ? (
								<div className="flex items-center justify-between">
									<div>
										<p className="text-red-400">Delete account</p>
										<p className="text-sm text-gray-400">
											Permanently delete your account and all data
										</p>
									</div>
									<Button
										variant="outline"
										className="border-red-600 text-red-400"
										onClick={() => setShowDeleteConfirm(true)}
									>
										<Trash2 className="h-4 w-4 mr-2" />
										Delete Account
									</Button>
								</div>
							) : (
								<div className="space-y-4 bg-red-900/20 p-4 rounded-lg border border-red-700">
									<p className="text-red-400 font-medium">
										Are you sure? This action cannot be undone.
									</p>
									<p className="text-sm text-gray-400">
										All your timestamps, verifications, and data will be
										permanently deleted.
									</p>
									<div>
										<Label htmlFor="deleteConfirm" className="text-gray-300">
											Type DELETE to confirm
										</Label>
										<Input
											id="deleteConfirm"
											value={deleteConfirmText}
											onChange={(e) => setDeleteConfirmText(e.target.value)}
											className="bg-gray-800 border-gray-600 text-white mt-1"
											placeholder="DELETE"
										/>
									</div>
									{error && <p className="text-sm text-red-400">{error}</p>}
									<div className="flex space-x-4">
										<Button
											variant="outline"
											className="border-gray-600 text-gray-300"
											onClick={() => {
												setShowDeleteConfirm(false)
												setDeleteConfirmText("")
												setError(null)
											}}
										>
											Cancel
										</Button>
										<Button
											variant="outline"
											className="border-red-600 text-red-400"
											onClick={handleDelete}
											disabled={isDeleting || deleteConfirmText !== "DELETE"}
										>
											{isDeleting ? (
												<Loader2 className="h-4 w-4 mr-2 animate-spin" />
											) : (
												<Trash2 className="h-4 w-4 mr-2" />
											)}
											Confirm Delete
										</Button>
									</div>
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
