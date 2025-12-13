"use client"

import { FeatureCard } from "@/features/shared/components/FeatureCard"
import { SectionHeader } from "@/features/shared/components/PageHeader"
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
					{features.map((feature) => (
						<FeatureCard
							key={feature.id}
							title={feature.title}
							description={feature.description}
							icon={feature.icon}
							accent={feature.accent}
							layout="stacked"
						/>
					))}
				</div>
			</div>
		</section>
	)
}
