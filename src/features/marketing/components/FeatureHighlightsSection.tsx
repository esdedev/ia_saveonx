"use client"

import { Card, CardContent } from "@/components/ui/card"
import { SectionHeader } from "@/features/shared/components"
import { getAccentStyles, getIconByName } from "@/features/shared/utils"
import type { FeatureHighlight } from "../types"

type FeatureHighlightsSectionProps = {
	features: FeatureHighlight[]
}

export function FeatureHighlightsSection({
	features
}: FeatureHighlightsSectionProps) {
	return (
		<section id="features" className="py-24 bg-gray-900/50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<SectionHeader
					title="Built for the Future of"
					highlight="Truth"
					description="Revolutionary technology that preserves digital truth with military-grade security and lightning-fast performance."
				/>

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
