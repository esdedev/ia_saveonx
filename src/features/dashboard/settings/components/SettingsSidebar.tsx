import { Card, CardContent } from "@/components/ui/card"
import type {
	SettingsTab,
	SettingsTabId
} from "@/features/dashboard/settings/types"

interface SettingsSidebarProps {
	tabs: SettingsTab[]
	activeTab: SettingsTabId
	onTabChange: (tabId: SettingsTabId) => void
}

export function SettingsSidebar({
	tabs,
	activeTab,
	onTabChange
}: SettingsSidebarProps) {
	return (
		<Card className="bg-gray-900/50 border-gray-700">
			<CardContent className="p-4">
				<nav className="space-y-2">
					{tabs.map((tab) => {
						const Icon = tab.icon

						return (
							<button
								key={tab.id}
								onClick={() => onTabChange(tab.id)}
								className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
									activeTab === tab.id
										? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
										: "text-gray-300 hover:text-white hover:bg-gray-800/50"
								}`}
								type="button"
							>
								<Icon className="h-4 w-4" />
								<span>{tab.label}</span>
							</button>
						)
					})}
				</nav>
			</CardContent>
		</Card>
	)
}
