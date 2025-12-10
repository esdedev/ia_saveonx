import { Bell, CreditCard, Key, Shield, User } from "lucide-react"
import type { SettingsTab } from "@/features/dashboard/settings/types"

export const SETTINGS_TABS: SettingsTab[] = [
	{ id: "profile", label: "Profile", icon: User },
	{ id: "billing", label: "Billing", icon: CreditCard },
	{ id: "security", label: "Security", icon: Shield },
	{ id: "notifications", label: "Notifications", icon: Bell },
	{ id: "api", label: "API Keys", icon: Key }
]
