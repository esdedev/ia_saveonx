import Link from "next/link"

export function SettingsNavigation() {
	return (
		<nav className="border-b border-gray-800 bg-black/90 backdrop-blur-xl sticky top-0 z-50 text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<Link href="/" className="flex items-center space-x-2">
						<div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
							<span className="text-white font-bold text-sm">S</span>
						</div>
						<span className="text-xl font-bold">SaveOnX</span>
					</Link>
					<div className="hidden md:flex items-center space-x-8">
						<Link
							href="/dashboard"
							className="text-gray-300 hover:text-white transition-colors"
						>
							Dashboard
						</Link>
						<Link
							href="/verify"
							className="text-gray-300 hover:text-white transition-colors"
						>
							Verify
						</Link>
						<Link href="/dashboard/settings" className="text-white font-medium">
							Settings
						</Link>
					</div>
					<div className="flex items-center space-x-4">
						<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
							<span className="text-white text-sm font-medium">JD</span>
						</div>
					</div>
				</div>
			</div>
		</nav>
	)
}
