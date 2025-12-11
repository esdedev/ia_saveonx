"use client"

import { Badge } from "@/components/ui/badge"
import type { BadgeVariant, IconName } from "../../../types/shared"
import { renderIcon } from "../utils/icons"
import { getBadgeClasses } from "../utils/styles"

interface StatusBadgeProps {
	/** Badge text label */
	label: string
	/** Visual variant */
	variant?: BadgeVariant
	/** Optional icon to show before the label */
	icon?: IconName
	/** Show checkmark before label (shortcut for success states) */
	showCheckmark?: boolean
	/** Additional className */
	className?: string
}

/**
 * Consistent status badge with optional icons.
 * Use for verification status, timestamps, alerts, etc.
 */
export function StatusBadge({
	label,
	variant = "neutral",
	icon,
	showCheckmark = false,
	className = ""
}: StatusBadgeProps) {
	const badgeClasses = getBadgeClasses(variant)

	return (
		<Badge className={`${badgeClasses} ${className}`}>
			{showCheckmark && variant === "success" && "✓ "}
			{icon && !showCheckmark && (
				<span className="mr-1">{renderIcon(icon, "h-3 w-3")}</span>
			)}
			{label}
		</Badge>
	)
}

// Preset badge components for common use cases
export function VerifiedBadge({ className = "" }: { className?: string }) {
	return (
		<StatusBadge
			label="Verified"
			variant="success"
			showCheckmark
			className={className}
		/>
	)
}

export function TimestampedBadge({ className = "" }: { className?: string }) {
	return (
		<StatusBadge
			label="Timestamped"
			variant="success"
			showCheckmark
			className={className}
		/>
	)
}

export function PendingBadge({ className = "" }: { className?: string }) {
	return <StatusBadge label="Pending" variant="warning" className={className} />
}

export function FailedBadge({ className = "" }: { className?: string }) {
	return <StatusBadge label="Failed" variant="error" className={className} />
}

export function DeletedBadge({ className = "" }: { className?: string }) {
	return (
		<StatusBadge label="Post Deleted" variant="error" className={className} />
	)
}
