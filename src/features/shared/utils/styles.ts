import type { AccentColor, BadgeVariant } from "../types"

/**
 * Semantic badge variant classes for consistent styling across the app.
 * Use these for status indicators, tags, and labels.
 */
export const BADGE_VARIANTS: Record<BadgeVariant, string> = {
	success: "bg-green-500/20 text-green-400 border-green-500/30",
	warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
	error: "bg-red-500/20 text-red-400 border-red-500/30",
	info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
	purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
	orange: "bg-orange-500/20 text-orange-400 border-orange-500/30",
	neutral: "bg-gray-500/20 text-gray-400 border-gray-500/30",
	primary: "bg-blue-500 text-white border-blue-500"
}

/**
 * Returns badge CSS classes for a given semantic variant.
 */
export function getBadgeClasses(variant: BadgeVariant): string {
	return BADGE_VARIANTS[variant]
}

/**
 * Maps common status strings to badge variants.
 */
export function getStatusBadgeVariant(
	status: "verified" | "pending" | "failed" | "open" | "connecting" | "closed"
): BadgeVariant {
	switch (status) {
		case "verified":
		case "open":
			return "success"
		case "pending":
		case "connecting":
			return "warning"
		case "failed":
		case "closed":
			return "error"
		default:
			return "neutral"
	}
}

/**
 * Accent color style configurations for cards, icons, and interactive elements.
 */
export const ACCENT_STYLES: Record<
	AccentColor,
	{
		card: string
		iconWrapper: string
		icon: string
		hoverBorder: string
		bgLight: string
		bgLightHover: string
		text: string
	}
> = {
	blue: {
		card: "bg-gray-800/50 border border-gray-700 hover:border-blue-500/50",
		iconWrapper:
			"w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500/30",
		icon: "h-6 w-6 text-blue-400",
		hoverBorder: "hover:border-blue-500/50",
		bgLight: "bg-blue-500/20",
		bgLightHover: "group-hover:bg-blue-500/30",
		text: "text-blue-400"
	},
	purple: {
		card: "bg-gray-800/50 border border-gray-700 hover:border-purple-500/50",
		iconWrapper:
			"w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-500/30",
		icon: "h-6 w-6 text-purple-400",
		hoverBorder: "hover:border-purple-500/50",
		bgLight: "bg-purple-500/20",
		bgLightHover: "group-hover:bg-purple-500/30",
		text: "text-purple-400"
	},
	green: {
		card: "bg-gray-800/50 border border-gray-700 hover:border-green-500/50",
		iconWrapper:
			"w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-500/30",
		icon: "h-6 w-6 text-green-400",
		hoverBorder: "hover:border-green-500/50",
		bgLight: "bg-green-500/20",
		bgLightHover: "group-hover:bg-green-500/30",
		text: "text-green-400"
	},
	yellow: {
		card: "bg-gray-800/50 border border-gray-700 hover:border-yellow-500/50",
		iconWrapper:
			"w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-yellow-500/30",
		icon: "h-6 w-6 text-yellow-400",
		hoverBorder: "hover:border-yellow-500/50",
		bgLight: "bg-yellow-500/20",
		bgLightHover: "group-hover:bg-yellow-500/30",
		text: "text-yellow-400"
	},
	orange: {
		card: "bg-gray-800/50 border border-gray-700 hover:border-orange-500/50",
		iconWrapper:
			"w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-500/30",
		icon: "h-6 w-6 text-orange-400",
		hoverBorder: "hover:border-orange-500/50",
		bgLight: "bg-orange-500/20",
		bgLightHover: "group-hover:bg-orange-500/30",
		text: "text-orange-400"
	}
}

/**
 * Returns accent style configuration for a given color.
 */
export function getAccentStyles(accent: AccentColor) {
	return ACCENT_STYLES[accent]
}

/**
 * Small icon wrapper styles (8x8) for use case lists and inline icons.
 */
export function getSmallIconStyles(accent: AccentColor) {
	const styles = ACCENT_STYLES[accent]
	return {
		wrapper: `w-8 h-8 ${styles.bgLight} rounded-lg`,
		icon: `h-4 w-4 ${styles.text}`
	}
}
