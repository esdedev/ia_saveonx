import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { NotificationPreferences } from "@/features/dashboard/settings/types"

interface NotificationsSettingsSectionProps {
	preferences: NotificationPreferences
	onToggle: (key: keyof NotificationPreferences, checked: boolean) => void
}

export function NotificationsSettingsSection({
	preferences,
	onToggle
}: NotificationsSettingsSectionProps) {
	return (
		<div className="space-y-6">
			<Card className="bg-gray-900/50 border-gray-700">
				<CardHeader>
					<CardTitle className="text-white">Notification Preferences</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<NotificationRow
						title="Email notifications"
						description="Receive updates via email"
						checked={preferences.email}
						onChange={(checked) => onToggle("email", checked)}
					/>
					<NotificationRow
						title="Browser notifications"
						description="Show notifications in your browser"
						checked={preferences.browser}
						onChange={(checked) => onToggle("browser", checked)}
					/>
					<NotificationRow
						title="Verification alerts"
						description="Get notified when posts are verified"
						checked={preferences.verification}
						onChange={(checked) => onToggle("verification", checked)}
					/>
					<NotificationRow
						title="Billing notifications"
						description="Important billing and payment updates"
						checked={preferences.billing}
						onChange={(checked) => onToggle("billing", checked)}
					/>
					<Button className="bg-blue-500 hover:bg-blue-600 text-white">
						<Save className="h-4 w-4 mr-2" />
						Save Preferences
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}

interface NotificationRowProps {
	title: string
	description: string
	checked: boolean
	onChange: (checked: boolean) => void
}

function NotificationRow({
	title,
	description,
	checked,
	onChange
}: NotificationRowProps) {
	return (
		<div className="flex items-center justify-between">
			<div>
				<p className="text-gray-300">{title}</p>
				<p className="text-sm text-gray-400">{description}</p>
			</div>
			<input
				type="checkbox"
				checked={checked}
				onChange={(event) => onChange(event.target.checked)}
				className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
			/>
		</div>
	)
}
