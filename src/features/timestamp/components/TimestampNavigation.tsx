import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/features/shared/components"

export function TimestampNavigation() {
	return (
		<nav className="border-b border-gray-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<Logo href="/" showText size="sm" />
					<div className="hidden md:flex items-center space-x-8">
						<Link
							href="/"
							className="text-gray-300 hover:text-white transition-colors"
						>
							Home
						</Link>
						<Link
							href="/verify"
							className="text-gray-300 hover:text-white transition-colors"
						>
							Verify
						</Link>
						<Link
							href="/dashboard"
							className="text-gray-300 hover:text-white transition-colors"
						>
							Dashboard
						</Link>
					</div>
					<div className="flex items-center space-x-4">
						<Button variant="ghost" className="text-gray-300 hover:text-white">
							Sign In
						</Button>
						<Button className="bg-blue-500 hover:bg-blue-600 text-white">
							Get Started
						</Button>
					</div>
				</div>
			</div>
		</nav>
	)
}
