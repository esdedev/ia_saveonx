"use client"

import type { LucideIcon } from "lucide-react"
import {
	AlertCircle,
	ArrowRight,
	Bell,
	Check,
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	Clock,
	Copy,
	CreditCard,
	Download,
	Edit,
	ExternalLink,
	Eye,
	EyeOff,
	Key,
	Link,
	Loader,
	Menu,
	Plus,
	RefreshCw,
	Search,
	Settings,
	Share,
	Shield,
	Trash,
	Twitter,
	User,
	Users,
	X,
	XCircle,
	Zap
} from "lucide-react"
import type { IconName } from "../types"

/**
 * Maps icon identifiers to Lucide React components.
 * This allows passing serializable icon names from server to client.
 */
const ICON_MAP: Record<IconName, LucideIcon> = {
	arrowRight: ArrowRight,
	search: Search,
	checkCircle: CheckCircle,
	shield: Shield,
	zap: Zap,
	clock: Clock,
	users: Users,
	xCircle: XCircle,
	alertCircle: AlertCircle,
	twitter: Twitter,
	link: Link,
	copy: Copy,
	download: Download,
	share: Share,
	settings: Settings,
	bell: Bell,
	key: Key,
	creditCard: CreditCard,
	user: User,
	chevronLeft: ChevronLeft,
	chevronRight: ChevronRight,
	plus: Plus,
	trash: Trash,
	edit: Edit,
	eye: Eye,
	eyeOff: EyeOff,
	externalLink: ExternalLink,
	menu: Menu,
	x: X,
	check: Check,
	loader: Loader,
	refresh: RefreshCw
}

/**
 * Returns a Lucide icon component for the given icon name.
 * Returns undefined if the name is not provided.
 */
export function getIconByName(
	name: IconName | undefined
): LucideIcon | undefined {
	if (!name) {
		return undefined
	}
	return ICON_MAP[name]
}

/**
 * Renders an icon by name with the given className.
 * Returns null if no icon name is provided.
 */
export function renderIcon(name: IconName | undefined, className?: string) {
	const Icon = getIconByName(name)
	if (!Icon) return null
	return <Icon className={className} />
}
