import { Settings } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/features/shared/components"
import { ConnectionStatus } from "./ConnectionStatus"

interface DashboardNavigationProps {
	connectionState: "connecting" | "open" | "closing" | "closed"
	notifications: Array<Record<string, unknown>>
	unreadCount: number
	onMarkAsRead: (notificationId: string) => void
	onMarkAllAsRead: () => void
	onClearNotification: (notificationId: string) => void
	onClearAll: () => void
}

export function DashboardNavigation({
	connectionState,
	notifications,
	unreadCount,
	onMarkAsRead,
	onMarkAllAsRead,
	onClearNotification,
	onClearAll
}: DashboardNavigationProps) {
	return (
		<nav className="border-b border-gray-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<Logo href="/" showText size="sm" />
					<div className="hidden md:flex items-center space-x-8">
						<Link href="/dashboard" className="text-white font-medium">
							Dashboard
						</Link>
						<Link
							href="/verify"
							className="text-gray-300 hover:text-white transition-colors"
						>
							Verify
						</Link>
						<Link
							href="/dashboard/settings"
							className="text-gray-300 hover:text-white transition-colors"
						>
							Settings
						</Link>
					</div>
					<div className="flex items-center space-x-4">
						{/* <NotificationCenter
							notifications={notifications}
							unreadCount={unreadCount}
							onMarkAsRead={onMarkAsRead}
							onMarkAllAsRead={onMarkAllAsRead}
							onClearNotification={onClearNotification}
							onClearAll={onClearAll}
						/> */}
						<Button
							variant="ghost"
							size="sm"
							className="text-gray-300 hover:text-white"
						>
							<Settings className="h-4 w-4" />
						</Button>
						<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
							<span className="text-white text-sm font-medium">JD</span>
						</div>
						<ConnectionStatus status={connectionState} />
					</div>
				</div>
			</div>
		</nav>
	)
}
