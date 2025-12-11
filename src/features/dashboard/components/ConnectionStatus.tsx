"use client"

import { Loader2, Wifi, WifiOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { BadgeVariant } from "@/types/shared"
import { getBadgeClasses } from "@/features/shared/utils/styles"

interface ConnectionStatusProps {
	status: "connecting" | "open" | "closing" | "closed"
}

interface StatusConfig {
	icon: React.ReactNode
	text: string
	variant: BadgeVariant
}

export function ConnectionStatus({ status }: ConnectionStatusProps) {
	const getStatusConfig = (): StatusConfig => {
		switch (status) {
			case "open":
				return {
					icon: <Wifi className="h-3 w-3" />,
					text: "Connected",
					variant: "success"
				}
			case "connecting":
				return {
					icon: <Loader2 className="h-3 w-3 animate-spin" />,
					text: "Connecting",
					variant: "warning"
				}
			case "closing":
				return {
					icon: <WifiOff className="h-3 w-3" />,
					text: "Disconnecting",
					variant: "orange"
				}
			case "closed":
				return {
					icon: <WifiOff className="h-3 w-3" />,
					text: "Disconnected",
					variant: "error"
				}
		}
	}

	const config = getStatusConfig()

	return (
		<Badge className={`${getBadgeClasses(config.variant)} text-xs`}>
			{config.icon}
			<span className="ml-1">{config.text}</span>
		</Badge>
	)
}
