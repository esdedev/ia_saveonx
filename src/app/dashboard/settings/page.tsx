"use client"

import { useState } from "react"
import { ApiSettingsSection } from "@/features/dashboard/settings/components/ApiSettingsSection"
import { BillingSettingsSection } from "@/features/dashboard/settings/components/BillingSettingsSection"
import { NotificationsSettingsSection } from "@/features/dashboard/settings/components/NotificationsSettingsSection"
import { ProfileSettingsSection } from "@/features/dashboard/settings/components/ProfileSettingsSection"
import { SecuritySettingsSection } from "@/features/dashboard/settings/components/SecuritySettingsSection"
import { SettingsNavigation } from "@/features/dashboard/settings/components/SettingsNavigation"
import { SettingsSidebar } from "@/features/dashboard/settings/components/SettingsSidebar"
import { SETTINGS_TABS } from "@/features/dashboard/settings/data/tabs"
import type {
	NotificationPreferences,
	SettingsTabId
} from "@/features/dashboard/settings/types"

export default function SettingsPage() {
	const [activeTab, setActiveTab] = useState<SettingsTabId>("profile")
	const [notificationPreferences, setNotificationPreferences] =
		useState<NotificationPreferences>({
			email: true,
			browser: false,
			verification: true,
			billing: true
		})

	const renderActiveTab = () => {
		switch (activeTab) {
			case "profile":
				return <ProfileSettingsSection />
			case "billing":
				return <BillingSettingsSection />
			case "security":
				return <SecuritySettingsSection />
			case "notifications":
				return (
					<NotificationsSettingsSection
						preferences={notificationPreferences}
						onToggle={(key, value) =>
							setNotificationPreferences((previous) => ({
								...previous,
								[key]: value
							}))
						}
					/>
				)
			case "api":
				return <ApiSettingsSection />
			default:
				return null
		}
	}

	return (
		<div className="min-h-screen bg-black text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex flex-col lg:flex-row gap-8">
					<div className="lg:w-64">
						<SettingsSidebar
							tabs={SETTINGS_TABS}
							activeTab={activeTab}
							onTabChange={setActiveTab}
						/>
					</div>
					<div className="flex-1">{renderActiveTab()}</div>
				</div>
			</div>
		</div>
	)
}
