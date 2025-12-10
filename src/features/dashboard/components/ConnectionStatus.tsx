"use client"

import { Loader2, Wifi, WifiOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ConnectionStatusProps {
	status: "connecting" | "open" | "closing" | "closed"
}

export function ConnectionStatus({ status }: ConnectionStatusProps) {
	const getStatusConfig = () => {
		switch (status) {
			case "open":
				return {
					icon: <Wifi className="h-3 w-3" />,
					text: "Connected",
					className: "bg-green-500/20 text-green-400 border-green-500/30"
				}
			case "connecting":
				return {
					icon: <Loader2 className="h-3 w-3 animate-spin" />,
					text: "Connecting",
					className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
				}
			case "closing":
				return {
					icon: <WifiOff className="h-3 w-3" />,
					text: "Disconnecting",
					className: "bg-orange-500/20 text-orange-400 border-orange-500/30"
				}
			case "closed":
				return {
					icon: <WifiOff className="h-3 w-3" />,
					text: "Disconnected",
					className: "bg-red-500/20 text-red-400 border-red-500/30"
				}
		}
	}

	const config = getStatusConfig()

	return (
		<Badge className={`${config.className} text-xs`}>
			{config.icon}
			<span className="ml-1">{config.text}</span>
		</Badge>
	)
}
