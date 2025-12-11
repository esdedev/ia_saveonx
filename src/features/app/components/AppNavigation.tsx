"use client"

import {
	CheckCircle,
	FileText,
	LayoutDashboard,
	LogOut,
	Settings,
	User
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Logo } from "@/features/shared/components/Logo"
import type { Session } from "@/services/auth/auth"
import { signOut } from "@/services/auth/auth-client"

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

interface AppNavigationProps {
	session: Session | null
}

export function AppNavigation({ session }: AppNavigationProps) {
	const pathname = usePathname()

	const handleSignOut = async () => {
		await signOut()
		window.location.href = "/"
	}

	const userInitial =
		session?.user?.name?.[0]?.toUpperCase() ||
		session?.user?.email?.[0]?.toUpperCase() ||
		"U"
	const userName = session?.user?.name || session?.user?.email || "User"
	const userEmail = session?.user?.email

	return (
		<nav className="border-b border-gray-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<Logo href="/" showText size="sm" />

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-1">
						{navLinks.map((link) => {
							const Icon = link.icon
							const isActive =
								pathname === link.href || pathname?.startsWith(`${link.href}/`)

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

						{/* User Menu */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black">
									<span className="text-white text-sm font-medium">
										{userInitial}
									</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuLabel>
									<div className="flex flex-col space-y-1">
										<p className="text-sm font-medium leading-none">
											{userName}
										</p>
										{userEmail && (
											<p className="text-xs leading-none text-muted-foreground">
												{userEmail}
											</p>
										)}
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link href="/dashboard/settings" className="cursor-pointer">
										<User className="mr-2 h-4 w-4" />
										<span>Profile</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/dashboard/settings" className="cursor-pointer">
										<Settings className="mr-2 h-4 w-4" />
										<span>Settings</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={handleSignOut}
									className="cursor-pointer text-red-600"
								>
									<LogOut className="mr-2 h-4 w-4" />
									<span>Sign out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
		</nav>
	)
}
