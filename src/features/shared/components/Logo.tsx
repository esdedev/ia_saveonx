import Link from "next/link"

type LogoSize = "sm" | "md" | "lg"

interface LogoProps {
	size?: LogoSize
	showText?: boolean
	href?: string
	className?: string
}

const SIZE_CONFIG: Record<LogoSize, { container: string; text: string }> = {
	sm: { container: "w-6 h-6 text-xs", text: "text-lg" },
	md: { container: "w-8 h-8 text-sm", text: "text-xl" },
	lg: { container: "w-10 h-10 text-base", text: "text-2xl" }
}

function LogoContent({ size = "md", showText = true }: LogoProps) {
	const config = SIZE_CONFIG[size]

	return (
		<div className="flex items-center space-x-2">
			<div
				className={`${config.container} bg-blue-500 rounded-lg flex items-center justify-center`}
			>
				<span className="text-white font-bold">S</span>
			</div>
			{showText && (
				<span className={`${config.text} font-bold text-white`}>SaveOnX</span>
			)}
		</div>
	)
}

/**
 * SaveOnX brand logo component.
 * Use this instead of duplicating logo markup across navigation, footer, etc.
 */
export function Logo({
	size = "md",
	showText = true,
	href = "/",
	className
}: LogoProps) {
	if (href) {
		return (
			<Link
				href={href}
				className={`flex items-center space-x-2 ${className ?? ""}`}
			>
				<LogoContent size={size} showText={showText} />
			</Link>
		)
	}

	return (
		<div className={className}>
			<LogoContent size={size} showText={showText} />
		</div>
	)
}
