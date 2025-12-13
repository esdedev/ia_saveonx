import { Fragment } from "react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/features/shared/components/StatusBadge"
import { getIconByName, renderIcon } from "@/features/shared/utils/icons"
import type { CallToActionButton, HeroValueProp } from "../types"

type MarketingHeroProps = {
	badge: string
	title: string
	highlight: string
	description: string
	primaryAction: CallToActionButton
	secondaryAction: CallToActionButton
	valueProps: HeroValueProp[]
}

// Value prop icon colors by accent
const VALUE_PROP_ICON_COLORS: Record<HeroValueProp["accent"], string> = {
	blue: "text-blue-400",
	purple: "text-purple-400",
	yellow: "text-yellow-400"
}

export function MarketingHero({
	badge,
	title,
	highlight,
	description,
	primaryAction,
	secondaryAction,
	valueProps
}: MarketingHeroProps) {
	return (
		<section className="relative overflow-hidden">
			<div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-transparent to-purple-500/10" />
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
				<div className="text-center">
					<StatusBadge label={badge} variant="info" className="mb-6" />
					<h1 className="text-5xl md:text-7xl font-bold mb-8 bg-linear-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
						{title}
						<br />
						<span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
							{highlight}
						</span>
					</h1>
					<p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
						{description}
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
						<Button
							size="lg"
							className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg"
							asChild
						>
							<a href={primaryAction.href}>
								{primaryAction.label}
								{renderIcon(primaryAction.icon, "ml-2 h-5 w-5")}
							</a>
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 px-8 py-4 text-lg"
							asChild
						>
							<a href={secondaryAction.href}>
								{secondaryAction.label}
								{renderIcon(secondaryAction.icon, "ml-2 h-5 w-5")}
							</a>
						</Button>
					</div>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-sm text-gray-400">
						{valueProps.map((item, index) => {
							const iconColor =
								VALUE_PROP_ICON_COLORS[item.accent] ?? "text-gray-400"
							const Icon = getIconByName(item.icon)
							return (
								<Fragment key={item.id}>
									<div className="flex items-center space-x-2">
										{Icon ? <Icon className={`h-4 w-4 ${iconColor}`} /> : null}
										<span>{item.label}</span>
									</div>
									{index < valueProps.length - 1 && (
										<span className="hidden sm:block" aria-hidden>
											•
										</span>
									)}
								</Fragment>
							)
						})}
					</div>
				</div>
			</div>
		</section>
	)
}
