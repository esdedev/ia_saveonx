"use client"

import { Button } from "@/components/ui/button"
import type { CallToActionButton, CallToActionContent } from "../types"
import { getIconByName } from "../utils/icons"

type CallToActionSectionProps = {
	content: CallToActionContent
}

export function CallToActionSection({ content }: CallToActionSectionProps) {
	return (
		<section id="get-started" className="py-24">
			<div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
				<h2 className="text-4xl md:text-5xl font-bold mb-6">
					{content.heading}
					<span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
						{` ${content.emphasis}`}
					</span>
					?
				</h2>
				<p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
					{content.subheading}
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button
						size="lg"
						className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg"
						asChild
					>
						<a href={content.primaryAction.href}>
							{content.primaryAction.label}
							{renderActionIcon(content.primaryAction)}
						</a>
					</Button>
					<Button
						size="lg"
						variant="outline"
						className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 px-8 py-4 text-lg"
						asChild
					>
						<a href={content.secondaryAction.href}>
							{content.secondaryAction.label}
						</a>
					</Button>
				</div>
			</div>
		</section>
	)
}

function renderActionIcon(action: CallToActionButton) {
	const Icon = getIconByName(action.icon)
	return Icon ? <Icon className="ml-2 h-5 w-5" /> : null
}
