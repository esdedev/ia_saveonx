"use client"

import type { LucideIcon } from "lucide-react"
import {
	ArrowRight,
	CheckCircle,
	Clock,
	Search,
	Shield,
	Users,
	Zap
} from "lucide-react"
import type { IconName } from "../types"

const ICON_MAP: Record<IconName, LucideIcon> = {
	arrowRight: ArrowRight,
	search: Search,
	checkCircle: CheckCircle,
	shield: Shield,
	zap: Zap,
	clock: Clock,
	users: Users
}

export function getIconByName(name: IconName | undefined) {
	if (!name) {
		return undefined
	}

	return ICON_MAP[name]
}
