"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { FeatureHighlight } from "../types"
import { getIconByName } from "../utils/icons"

type FeatureHighlightsSectionProps = {
	features: FeatureHighlight[]
}

export function FeatureHighlightsSection({
	features
}: FeatureHighlightsSectionProps) {
	return (
		<section id="features" className="py-24 bg-gray-900/50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl font-bold mb-6">
						Built for the Future of
						<span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
							{" "}
							Truth
						</span>
					</h2>
					<p className="text-xl text-gray-300 max-w-3xl mx-auto">
						Revolutionary technology that preserves digital truth with
						military-grade security and lightning-fast performance.
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8">
					{features.map((feature) => {
						const accent = getAccentStyles(feature.accent)
						const Icon = getIconByName(feature.icon)
						return (
							<Card
								key={feature.id}
								className={`${accent.card} transition-all duration-300 group`}
							>
								<CardContent className="p-8">
									<div className={`${accent.iconWrapper} transition-colors`}>
										{Icon ? <Icon className={accent.icon} /> : null}
									</div>
									<h3 className="text-xl font-bold mb-4 text-white">
										{feature.title}
									</h3>
									<p className="text-gray-300 leading-relaxed">
										{feature.description}
									</p>
								</CardContent>
							</Card>
						)
					})}
				</div>
			</div>
		</section>
	)
}

function getAccentStyles(accent: FeatureHighlight["accent"]) {
	switch (accent) {
		case "blue":
			return {
				card: "bg-gray-800/50 border border-gray-700 hover:border-blue-500/50",
				iconWrapper:
					"w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500/30",
				icon: "h-6 w-6 text-blue-400"
			}
		case "purple":
			return {
				card: "bg-gray-800/50 border border-gray-700 hover:border-purple-500/50",
				iconWrapper:
					"w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-500/30",
				icon: "h-6 w-6 text-purple-400"
			}
		case "green":
			return {
				card: "bg-gray-800/50 border border-gray-700 hover:border-green-500/50",
				iconWrapper:
					"w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-500/30",
				icon: "h-6 w-6 text-green-400"
			}
		default:
			return {
				card: "bg-gray-800/50 border border-gray-700",
				iconWrapper:
					"w-12 h-12 bg-gray-500/20 rounded-lg flex items-center justify-center mb-6",
				icon: "h-6 w-6 text-gray-300"
			}
	}
}
