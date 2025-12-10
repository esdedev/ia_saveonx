import { Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const API_KEYS = [
	{
		name: "Production Key",
		maskedValue: "sk_live_••••••••••••••••••••••••••••",
		createdAt: "Created Jan 15, 2024"
	},
	{
		name: "Test Key",
		maskedValue: "sk_test_••••••••••••••••••••••••••••",
		createdAt: "Created Jan 10, 2024"
	}
]

export function ApiSettingsSection() {
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

					<div className="space-y-3">
						{API_KEYS.map((apiKey) => (
							<div
								key={apiKey.name}
								className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
							>
								<div>
									<div className="font-medium text-white">{apiKey.name}</div>
									<div className="text-sm text-gray-400 font-mono">
										{apiKey.maskedValue}
									</div>
									<div className="text-xs text-gray-500 mt-1">
										{apiKey.createdAt}
									</div>
								</div>
								<div className="flex items-center space-x-2">
									<Button
										variant="ghost"
										size="sm"
										className="text-gray-400 hover:text-white"
									>
										Copy
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="text-red-400 hover:text-red-300"
									>
										Revoke
									</Button>
								</div>
							</div>
						))}
					</div>

					<Button className="bg-blue-500 hover:bg-blue-600 text-white">
						<Key className="h-4 w-4 mr-2" />
						Generate New Key
					</Button>
				</CardContent>
			</Card>

			<Card className="bg-gray-900/50 border-gray-700">
				<CardHeader>
					<CardTitle className="text-white">API Usage</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="bg-gray-800/50 rounded-lg p-4">
							<div className="text-2xl font-bold text-white">1,247</div>
							<div className="text-sm text-gray-400">API Calls This Month</div>
						</div>
						<div className="bg-gray-800/50 rounded-lg p-4">
							<div className="text-2xl font-bold text-white">8,753</div>
							<div className="text-sm text-gray-400">Remaining Calls</div>
						</div>
						<div className="bg-gray-800/50 rounded-lg p-4">
							<div className="text-2xl font-bold text-white">99.9%</div>
							<div className="text-sm text-gray-400">Uptime</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
