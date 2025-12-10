import {
	Calendar,
	CreditCard,
	FileText,
	Shield,
	TrendingUp
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { UserStats } from "@/features/dashboard/types"

interface StatsOverviewProps {
	stats: UserStats
}

export function StatsOverview({ stats }: StatsOverviewProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<Card className="bg-gray-900/50 border-gray-700">
				<CardContent className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-400 text-sm">Total Timestamps</p>
							<p className="text-2xl font-bold text-white">
								{stats.totalTimestamps}
							</p>
						</div>
						<div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
							<FileText className="h-6 w-6 text-blue-400" />
						</div>
					</div>
					<div className="flex items-center mt-4 text-sm">
						<TrendingUp className="h-4 w-4 text-green-400 mr-1" />
						<span className="text-green-400">+12%</span>
						<span className="text-gray-400 ml-1">from last month</span>
					</div>
				</CardContent>
			</Card>

			<Card className="bg-gray-900/50 border-gray-700">
				<CardContent className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-400 text-sm">This Month</p>
							<p className="text-2xl font-bold text-white">{stats.thisMonth}</p>
						</div>
						<div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
							<Calendar className="h-6 w-6 text-green-400" />
						</div>
					</div>
					<div className="flex items-center mt-4 text-sm">
						<span className="text-gray-400">3 remaining in plan</span>
					</div>
				</CardContent>
			</Card>

			<Card className="bg-gray-900/50 border-gray-700">
				<CardContent className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-400 text-sm">Verifications</p>
							<p className="text-2xl font-bold text-white">
								{stats.verifications}
							</p>
						</div>
						<div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
							<Shield className="h-6 w-6 text-purple-400" />
						</div>
					</div>
					<div className="flex items-center mt-4 text-sm">
						<span className="text-gray-400">Across all timestamps</span>
					</div>
				</CardContent>
			</Card>

			<Card className="bg-gray-900/50 border-gray-700">
				<CardContent className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-400 text-sm">Cost Savings</p>
							<p className="text-2xl font-bold text-white">
								{stats.savedCosts}
							</p>
						</div>
						<div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
							<CreditCard className="h-6 w-6 text-yellow-400" />
						</div>
					</div>
					<div className="flex items-center mt-4 text-sm">
						<span className="text-gray-400">vs individual timestamps</span>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
