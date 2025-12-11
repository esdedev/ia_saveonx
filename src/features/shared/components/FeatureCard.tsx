"use client"

import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AccentColor, IconName } from "../../../types/shared"
import { getIconByName } from "../utils/icons"
import { getAccentStyles } from "../utils/styles"

interface FeatureCardProps {
	/** Card title */
	title: string
	/** Card description */
	description: string
	/** Icon to display */
	icon?: IconName
	/** Accent color for styling */
	accent?: AccentColor
	/** Layout variant: 'inline' shows icon next to title, 'stacked' shows icon above */
	layout?: "inline" | "stacked"
	/** Additional content to render below description */
	children?: ReactNode
	/** Additional className for the card */
	className?: string
}

/**
 * Feature card with icon, title, and description.
 * Use for feature highlights, use cases, or info cards.
 */
export function FeatureCard({
	title,
	description,
	icon,
	accent = "blue",
	layout = "inline",
	children,
	className = ""
}: FeatureCardProps) {
	const styles = getAccentStyles(accent)
	const Icon = icon ? getIconByName(icon) : null

	if (layout === "stacked") {
		return (
			<Card
				className={`${styles.card} transition-all duration-300 group ${className}`}
			>
				<CardContent className="p-8">
					{Icon && (
						<div className={`${styles.iconWrapper} transition-colors mb-6`}>
							<Icon className={styles.icon} />
						</div>
					)}
					<h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
					<p className="text-gray-300 leading-relaxed">{description}</p>
					{children}
				</CardContent>
			</Card>
		)
	}

	return (
		<Card
			className={`${styles.card} transition-all duration-300 hover:scale-[1.02] ${className}`}
		>
			<CardHeader>
				<div className="flex items-center space-x-3">
					{Icon && (
						<div className={`${styles.iconWrapper} p-3 rounded-xl`}>
							<Icon className={`${styles.icon} h-6 w-6`} />
						</div>
					)}
					<CardTitle className="text-white text-lg">{title}</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<p className="text-gray-300 leading-relaxed">{description}</p>
				{children}
			</CardContent>
		</Card>
	)
}

interface FeatureListItemProps {
	/** Title text */
	title: string
	/** Description text */
	description: string
	/** Icon to display */
	icon?: IconName
	/** Accent color for styling */
	accent?: AccentColor
	/** Additional className */
	className?: string
}

/**
 * Compact feature item for lists.
 * Use for feature lists, use case items, or value props.
 */
export function FeatureListItem({
	title,
	description,
	icon,
	accent = "blue",
	className = ""
}: FeatureListItemProps) {
	const styles = getAccentStyles(accent)
	const Icon = icon ? getIconByName(icon) : null

	return (
		<div className={`flex items-start space-x-4 ${className}`}>
			{Icon && (
				<div
					className={`w-10 h-10 ${styles.iconWrapper} rounded-lg flex items-center justify-center shrink-0 mt-1`}
				>
					<Icon className={`h-5 w-5 ${styles.icon}`} />
				</div>
			)}
			<div>
				<h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
				<p className="text-gray-300">{description}</p>
			</div>
		</div>
	)
}
