import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/features/shared/components"

const BILLING_HISTORY = [
	{ date: "Jan 1, 2024", amount: "$29.00", status: "Paid" },
	{ date: "Dec 1, 2023", amount: "$29.00", status: "Paid" },
	{ date: "Nov 1, 2023", amount: "$29.00", status: "Paid" }
]

export function BillingSettingsSection() {
	return (
		<div className="space-y-6">
			<Card className="bg-gray-900/50 border-gray-700">
				<CardHeader>
					<CardTitle className="text-white">Current Plan</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between mb-6">
						<div>
							<h3 className="text-xl font-bold text-white">
								Professional Plan
							</h3>
							<p className="text-gray-400">1,000 timestamps per month</p>
							<p className="text-2xl font-bold text-white mt-2">
								$29<span className="text-lg text-gray-400">/month</span>
							</p>
						</div>
						<StatusBadge label="Active" variant="info" />
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<div className="bg-gray-800/50 rounded-lg p-4">
							<div className="text-2xl font-bold text-white">247</div>
							<div className="text-sm text-gray-400">Timestamps Used</div>
						</div>
						<div className="bg-gray-800/50 rounded-lg p-4">
							<div className="text-2xl font-bold text-white">753</div>
							<div className="text-sm text-gray-400">Remaining</div>
						</div>
						<div className="bg-gray-800/50 rounded-lg p-4">
							<div className="text-2xl font-bold text-white">12</div>
							<div className="text-sm text-gray-400">Days Left</div>
						</div>
					</div>
					<div className="flex space-x-4">
						<Button variant="outline" className="border-gray-600 text-gray-300">
							Change Plan
						</Button>
						<Button variant="outline" className="border-red-600 text-red-400">
							Cancel Subscription
						</Button>
					</div>
				</CardContent>
			</Card>

			<Card className="bg-gray-900/50 border-gray-700">
				<CardHeader>
					<CardTitle className="text-white">Payment Method</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center space-x-3">
							<div className="w-12 h-8 bg-blue-500 rounded flex items-center justify-center">
								<span className="text-white text-xs font-bold">VISA</span>
							</div>
							<div>
								<div className="text-white">•••• •••• •••• 4242</div>
								<div className="text-sm text-gray-400">Expires 12/25</div>
							</div>
						</div>
						<Button
							variant="outline"
							size="sm"
							className="border-gray-600 text-gray-300"
						>
							Update
						</Button>
					</div>
				</CardContent>
			</Card>

			<Card className="bg-gray-900/50 border-gray-700">
				<CardHeader>
					<CardTitle className="text-white">Billing History</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{BILLING_HISTORY.map((invoice) => (
							<div
								key={invoice.date}
								className="flex items-center justify-between py-2 border-b border-gray-800"
							>
								<div>
									<div className="text-white">{invoice.date}</div>
									<div className="text-sm text-gray-400">Professional Plan</div>
								</div>
								<div className="text-right">
									<div className="text-white">{invoice.amount}</div>
									<StatusBadge
										label={invoice.status}
										variant="success"
										className="text-xs"
									/>
								</div>
								<Button
									variant="ghost"
									size="sm"
									className="text-gray-400 hover:text-white"
								>
									<Download className="h-4 w-4" />
								</Button>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
