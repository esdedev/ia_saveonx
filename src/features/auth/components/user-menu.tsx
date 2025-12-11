"use client"

import { useSession } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogoutButton } from "./logout-button"
import { User, Settings, Shield } from "lucide-react"
import Link from "next/link"

export function UserMenu() {
	const { data: session, isPending } = useSession()

	if (isPending) {
		return (
			<div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
		)
	}

	if (!session?.user) {
		return (
			<div className="flex gap-2">
				<Button variant="ghost" size="sm" asChild>
					<Link href="/login">Iniciar Sesión</Link>
				</Button>
				<Button size="sm" asChild>
					<Link href="/register">Registrarse</Link>
				</Button>
			</div>
		)
	}

	const { user } = session
	const isAdmin = user.role === "admin"
	const initials = user.name
		?.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2) || "U"

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-8 w-8 rounded-full">
					<Avatar className="h-8 w-8">
						<AvatarImage src={user.image || undefined} alt={user.name} />
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">{user.name}</p>
						<p className="text-xs leading-none text-muted-foreground">
							{user.email}
						</p>
						{isAdmin && (
							<span className="text-xs text-primary font-medium">
								Administrador
							</span>
						)}
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href="/dashboard" className="cursor-pointer">
						<User className="mr-2 h-4 w-4" />
						Mi Dashboard
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href="/dashboard/settings" className="cursor-pointer">
						<Settings className="mr-2 h-4 w-4" />
						Configuración
					</Link>
				</DropdownMenuItem>
				{isAdmin && (
					<DropdownMenuItem asChild>
						<Link href="/admin" className="cursor-pointer">
							<Shield className="mr-2 h-4 w-4" />
							Panel Admin
						</Link>
					</DropdownMenuItem>
				)}
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<LogoutButton variant="ghost" className="w-full justify-start cursor-pointer" />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
