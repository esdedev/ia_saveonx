import type { ComponentType } from "react"

export type SettingsTabId =
	| "profile"
	| "billing"
	| "security"
	| "notifications"
	| "api"

export interface SettingsTab {
	id: SettingsTabId
	label: string
	icon: ComponentType<{ className?: string }>
}

export interface NotificationPreferences {
	email: boolean
	browser: boolean
	verification: boolean
	billing: boolean
}
