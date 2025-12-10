import { SettingsNavigation } from "@/features/dashboard/settings/components/SettingsNavigation"

export default function VerifyLayoutPage({
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
