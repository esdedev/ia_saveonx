import {
	AlertTriangle,
	CheckCircle,
	Clock,
	type LucideIcon,
	XCircle
} from "lucide-react"
import type { TimestampStatus } from "@/features/dashboard/types"
import type { BadgeVariant } from "@/features/shared/types"
import { getBadgeClasses } from "@/features/shared/utils"

interface StatusConfig {
	icon: LucideIcon
	badgeClass: string
	badgeVariant: BadgeVariant
	label: string
}

const STATUS_CONFIG: Record<TimestampStatus, StatusConfig> = {
	verified: {
		icon: CheckCircle,
		badgeClass: getBadgeClasses("success"),
		badgeVariant: "success",
		label: "verified"
	},
	pending: {
		icon: Clock,
		badgeClass: getBadgeClasses("warning"),
		badgeVariant: "warning",
		label: "pending"
	},
	failed: {
		icon: XCircle,
		badgeClass: getBadgeClasses("error"),
		badgeVariant: "error",
		label: "failed"
	}
}

const DEFAULT_STATUS_CONFIG: StatusConfig = {
	icon: AlertTriangle,
	badgeClass: getBadgeClasses("neutral"),
	badgeVariant: "neutral",
	label: "unknown"
}

export const getStatusConfig = (status: TimestampStatus): StatusConfig =>
	STATUS_CONFIG[status] ?? DEFAULT_STATUS_CONFIG
