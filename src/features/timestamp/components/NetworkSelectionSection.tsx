import {
	AlertCircle,
	ChevronRight,
	DollarSign,
	Network as NetworkIcon
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { BlockchainOption } from "@/features/timestamp/types"

interface NetworkSelectionSectionProps {
	options: BlockchainOption[]
	selectedNetworkIds: string[]
	onToggleNetwork: (networkId: string) => void
	onBack: () => void
	onNext: () => void
	totalCost: number
}

export function NetworkSelectionSection({
	options,
	selectedNetworkIds,
	onToggleNetwork,
	onBack,
	onNext,
	totalCost
}: NetworkSelectionSectionProps) {
	const hasSelection = selectedNetworkIds.length > 0

	return (
		<div className="space-y-6 mb-8">
			<Card className="bg-gray-900/50 border-gray-700">
				<CardHeader>
					<CardTitle className="text-white flex items-center space-x-2">
						<NetworkIcon className="h-5 w-5 text-purple-400" />
						<span>Select Blockchain Networks</span>
					</CardTitle>
					<p className="text-gray-400 text-sm mt-2">
						Choose one or more networks to timestamp your post on.
					</p>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4">
						{options.map((network) => {
							const isSelected = selectedNetworkIds.includes(network.id)

							return (
								<button
									key={network.id}
									type="button"
									onClick={() => onToggleNetwork(network.id)}
									className={`text-left w-full p-4 rounded-lg border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
										isSelected
											? "bg-blue-500/10 border-blue-500/50"
											: "bg-gray-800/30 border-gray-700 hover:border-gray-600"
									}`}
								>
									<div className="flex items-start justify-between">
										<div className="flex items-start space-x-4 flex-1">
											<div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-xl shrink-0">
												{network.icon}
											</div>
											<div>
												<h3 className="font-bold text-white mb-1">
													{network.name}
												</h3>
												<div className="space-y-1 text-sm">
													<p className="text-gray-400">
														<span className="text-gray-500">Speed:</span>{" "}
														{network.speed}
													</p>
													<p className="text-gray-400">
														<span className="text-gray-500">Confirmation:</span>{" "}
														{network.confirmation}
													</p>
												</div>
											</div>
										</div>
										<div className="text-right shrink-0">
											<div className="flex items-center space-x-1 mb-2">
												<DollarSign className="h-4 w-4 text-yellow-400" />
												<span className="font-bold text-white">
													{network.cost}
												</span>
											</div>
											<Badge
												className={
													network.security === "high"
														? "bg-green-500/20 text-green-400 border-green-500/30"
														: network.security === "medium"
															? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
															: "bg-orange-500/20 text-orange-400 border-orange-500/30"
												}
											>
												{network.security.toUpperCase()}
											</Badge>
										</div>
									</div>
								</button>
							)
						})}
					</div>

					{!hasSelection && (
						<div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start space-x-3">
							<AlertCircle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
							<p className="text-yellow-400 text-sm">
								Please select at least one blockchain network.
							</p>
						</div>
					)}

					<div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mt-6">
						<div className="space-y-3">
							<h4 className="font-bold text-white flex items-center space-x-2">
								<DollarSign className="h-4 w-4 text-yellow-400" />
								<span>Cost Summary</span>
							</h4>
							<div className="space-y-2 text-sm">
								{selectedNetworkIds.map((networkId) => {
									const network = options.find((item) => item.id === networkId)

									return (
										<div
											key={networkId}
											className="flex justify-between text-gray-300"
										>
											<span>{network?.name}</span>
											<span className="font-medium">{network?.cost}</span>
										</div>
									)
								})}
							</div>
							<div className="border-t border-gray-700 pt-3 flex justify-between">
								<span className="font-bold text-white">Total Cost</span>
								<span className="font-bold text-blue-400 text-lg">
									{totalCost === 0 ? "Free" : `$${totalCost.toFixed(2)}`}
								</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="flex space-x-4">
				<Button
					variant="outline"
					className="flex-1 border-gray-600 text-gray-300 hover:text-white bg-transparent"
					onClick={onBack}
				>
					Back
				</Button>
				<Button
					className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
					onClick={onNext}
					disabled={!hasSelection}
				>
					Review & Submit
					<ChevronRight className="h-4 w-4 ml-2" />
				</Button>
			</div>
		</div>
	)
}
