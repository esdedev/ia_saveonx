"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Settings, FileText, CheckCircle, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/features/shared/components/Logo"

const navLinks = [
	{
		href: "/dashboard",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		href: "/timestamp",
		label: "Timestamp",
		icon: FileText
	},
	{
		href: "/verify",
		label: "Verify",
		icon: CheckCircle
	}
]

export function AppNavigation() {
	const pathname = usePathname()

	return (
		<nav className="border-b border-gray-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<Logo href="/" showText size="sm" />
					
					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-1">
						{navLinks.map((link) => {
							const Icon = link.icon
							const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`)
							
							return (
								<Link
									key={link.href}
									href={link.href}
									className={`
										flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
										${
											isActive
												? "bg-white/10 text-white"
												: "text-gray-300 hover:text-white hover:bg-white/5"
										}
									`}
								>
									<Icon className="h-4 w-4" />
									<span>{link.label}</span>
								</Link>
							)
						})}
					</div>

					{/* Right Side */}
					<div className="flex items-center space-x-4">
						<Link href="/dashboard/settings">
							<Button
								variant="ghost"
								size="sm"
								className="text-gray-300 hover:text-white"
							>
								<Settings className="h-4 w-4" />
							</Button>
						</Link>
						
						{/* User Avatar */}
						<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
							<span className="text-white text-sm font-medium">U</span>
						</div>
					</div>
				</div>
			</div>
		</nav>
	)
}
