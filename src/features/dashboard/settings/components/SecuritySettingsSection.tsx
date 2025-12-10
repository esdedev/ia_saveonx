import { AlertTriangle, Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SecuritySettingsSection() {
	return (
		<div className="space-y-6">
			<Card className="bg-gray-900/50 border-gray-700">
				<CardHeader>
					<CardTitle className="text-white">Password</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<Label htmlFor="currentPassword" className="text-gray-300">
							Current Password
						</Label>
						<Input
							id="currentPassword"
							type="password"
							className="bg-gray-800 border-gray-600 text-white"
						/>
					</div>
					<div>
						<Label htmlFor="newPassword" className="text-gray-300">
							New Password
						</Label>
						<Input
							id="newPassword"
							type="password"
							className="bg-gray-800 border-gray-600 text-white"
						/>
					</div>
					<div>
						<Label htmlFor="confirmPassword" className="text-gray-300">
							Confirm New Password
						</Label>
						<Input
							id="confirmPassword"
							type="password"
							className="bg-gray-800 border-gray-600 text-white"
						/>
					</div>
					<Button className="bg-blue-500 hover:bg-blue-600 text-white">
						Update Password
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
							</div>
							<Button
								variant="outline"
								className="border-gray-600 text-gray-300"
							>
								<Download className="h-4 w-4 mr-2" />
								Export Data
							</Button>
						</div>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-red-400">Delete account</p>
								<p className="text-sm text-gray-400">
									Permanently delete your account and all data
								</p>
							</div>
							<Button variant="outline" className="border-red-600 text-red-400">
								<Trash2 className="h-4 w-4 mr-2" />
								Delete Account
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
