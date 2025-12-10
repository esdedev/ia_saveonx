import { SettingsNavigation } from "@/features/dashboard/settings/components/SettingsNavigation"

export default function DashboardLayoutPage({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<>
			<SettingsNavigation />
			{children}
		</>
	)
}
