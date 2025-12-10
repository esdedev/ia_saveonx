import {
	AlertTriangle,
	CheckCircle,
	Clock,
	type LucideIcon,
	XCircle
} from "lucide-react"
import type { TimestampStatus } from "@/features/dashboard/types"

interface StatusConfig {
	icon: LucideIcon
	badgeClass: string
	label: string
}

const STATUS_CONFIG: Record<TimestampStatus, StatusConfig> = {
	verified: {
		icon: CheckCircle,
		badgeClass: "bg-green-500/20 text-green-400 border-green-500/30",
		label: "verified"
	},
	pending: {
		icon: Clock,
		badgeClass: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
		label: "pending"
	},
	failed: {
		icon: XCircle,
		badgeClass: "bg-red-500/20 text-red-400 border-red-500/30",
		label: "failed"
	}
}

const DEFAULT_STATUS_CONFIG: StatusConfig = {
	icon: AlertTriangle,
	badgeClass: "bg-gray-500/20 text-gray-400 border-gray-500/30",
	label: "unknown"
}

export const getStatusConfig = (status: TimestampStatus): StatusConfig =>
	STATUS_CONFIG[status] ?? DEFAULT_STATUS_CONFIG
