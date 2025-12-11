"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signUp, signIn } from "@/services/auth/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export function RegisterForm() {
	const router = useRouter()
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [error, setError] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [socialLoading, setSocialLoading] = useState<string | null>(null)

	const handleEmailRegister = async (e: React.FormEvent) => {
		e.preventDefault()
		setError("")

		if (password !== confirmPassword) {
			setError("Las contraseñas no coinciden")
			return
		}

		if (password.length < 8) {
			setError("La contraseña debe tener al menos 8 caracteres")
			return
		}

		setIsLoading(true)

		try {
			const { error } = await signUp.email({
				email,
				password,
				name,
			})

			if (error) {
				setError(error.message || "Error al registrarse")
				return
			}

			router.push("/dashboard")
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error desconocido")
		} finally {
			setIsLoading(false)
		}
	}

	const handleSocialLogin = async (provider: "google" | "apple") => {
		setSocialLoading(provider)
		setError("")

		try {
			await signIn.social({
				provider,
				callbackURL: "/dashboard",
			})
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error al conectar con el proveedor")
			setSocialLoading(null)
		}
	}

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader className="text-center">
				<CardTitle className="text-2xl">Crear Cuenta</CardTitle>
				<CardDescription>
					Regístrate en SaveOnX para proteger tu contenido
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Social Login Buttons */}
				<div className="grid grid-cols-2 gap-3">
					<Button
						variant="outline"
						onClick={() => handleSocialLogin("google")}
						disabled={socialLoading !== null}
						className="w-full"
					>
						{socialLoading === "google" ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
								<path
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									fill="#4285F4"
								/>
								<path
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									fill="#34A853"
								/>
								<path
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									fill="#FBBC05"
								/>
								<path
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									fill="#EA4335"
								/>
							</svg>
						)}
						Google
					</Button>
					<Button
						variant="outline"
						onClick={() => handleSocialLogin("apple")}
						disabled={socialLoading !== null}
						className="w-full"
					>
						{socialLoading === "apple" ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
								<path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
							</svg>
						)}
						Apple
					</Button>
				</div>

				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-background px-2 text-muted-foreground">
							O regístrate con email
						</span>
					</div>
				</div>

				{/* Email/Password Form */}
				<form onSubmit={handleEmailRegister} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Nombre</Label>
						<Input
							id="name"
							type="text"
							placeholder="Tu nombre"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							disabled={isLoading}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="tu@email.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							disabled={isLoading}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Contraseña</Label>
						<Input
							id="password"
							type="password"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							disabled={isLoading}
							minLength={8}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
						<Input
							id="confirmPassword"
							type="password"
							placeholder="••••••••"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
							disabled={isLoading}
						/>
					</div>

					{error && (
						<p className="text-sm text-destructive text-center">{error}</p>
					)}

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Crear Cuenta
					</Button>
				</form>
			</CardContent>
			<CardFooter className="flex justify-center">
				<p className="text-sm text-muted-foreground">
					¿Ya tienes cuenta?{" "}
					<Link href="/login" className="text-primary hover:underline">
						Inicia Sesión
					</Link>
				</p>
			</CardFooter>
		</Card>
	)
}
