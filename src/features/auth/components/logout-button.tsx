"use client"

import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { LogOut, Loader2 } from "lucide-react"
import { useState } from "react"

interface LogoutButtonProps {
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
	size?: "default" | "sm" | "lg" | "icon"
	showIcon?: boolean
	className?: string
}

export function LogoutButton({
	variant = "ghost",
	size = "default",
	showIcon = true,
	className,
}: LogoutButtonProps) {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	const handleLogout = async () => {
		setIsLoading(true)
		try {
			await signOut()
			router.push("/")
		} catch (error) {
			console.error("Error al cerrar sesión:", error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Button
			variant={variant}
			size={size}
			onClick={handleLogout}
			disabled={isLoading}
			className={className}
		>
			{isLoading ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : (
				<>
					{showIcon && <LogOut className="h-4 w-4 mr-2" />}
					Cerrar Sesión
				</>
			)}
		</Button>
	)
}
