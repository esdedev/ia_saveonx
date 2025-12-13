"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SectionHeader } from "@/features/shared/components/PageHeader"
import { StatusBadge } from "@/features/shared/components/StatusBadge"
import type { PricingPlan } from "../types"

type PricingSectionProps = {
	plans: PricingPlan[]
}

export function PricingSection({ plans }: PricingSectionProps) {
	return (
		<section id="pricing" className="py-24 bg-gray-900/50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<SectionHeader
					title="Simple,"
					highlight="Transparent"
					titleSuffix="Pricing"
					description="Budget-friendly plans that scale with your needs. Start free, upgrade when you're ready."
				/>

				<div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
					{plans.map((plan) => (
						<PlanCard key={plan.id} plan={plan} />
					))}
				</div>
			</div>
		</section>
	)
}

type PlanCardProps = {
	plan: PricingPlan
}

function PlanCard({ plan }: PlanCardProps) {
	const { cardClass, buttonClass } = getPlanStyles(plan)

	return (
		<Card className={cardClass}>
			<CardContent className="p-8">
				{plan.highlight && plan.badgeLabel ? (
					<div className="absolute -top-4 left-1/2 -translate-x-1/2">
						<StatusBadge label={plan.badgeLabel} variant="primary" />
					</div>
				) : null}

				<h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
				<div className="text-4xl font-bold mb-6 text-white">
					{plan.price}
					<span className="text-lg text-gray-400">{plan.priceSuffix}</span>
				</div>

				<ul className="space-y-3 mb-8">
					{plan.features.map((feature) => (
						<li key={feature} className="flex items-center space-x-3">
							<div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
								<span className="text-green-400 text-sm">✓</span>
							</div>
							<span className="text-gray-300">{feature}</span>
						</li>
					))}
				</ul>

				<Button className={buttonClass} asChild>
					<a href={plan.highlight ? "#get-started" : "#contact"}>
						{plan.ctaLabel}
					</a>
				</Button>
			</CardContent>
		</Card>
	)
}

function getPlanStyles(plan: PricingPlan) {
	if (plan.highlight) {
		return {
			cardClass:
				"relative bg-linear-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/50",
			buttonClass: "w-full bg-blue-500 hover:bg-blue-600 text-white"
		}
	}

	if (plan.id === "enterprise") {
		return {
			cardClass: "bg-gray-800/50 border border-gray-700 relative",
			buttonClass: "w-full bg-purple-500 hover:bg-purple-600 text-white"
		}
	}

	return {
		cardClass: "bg-gray-800/50 border border-gray-700 relative",
		buttonClass: "w-full bg-gray-700 hover:bg-gray-600 text-white"
	}
}
