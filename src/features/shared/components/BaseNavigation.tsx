"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Logo } from "./Logo"
import { ContentContainer } from "./PageLayout"

export interface NavLink {
	label: string
	href: string
	isActive?: boolean
}

export interface NavAction {
	label: string
	href: string
}

interface BaseNavigationProps {
	/** Navigation links */
	links?: NavLink[]
	/** Primary action button (e.g., "Get Started") */
	primaryAction?: NavAction
	/** Secondary action button (e.g., "Sign In") */
	secondaryAction?: NavAction
	/** Right-side slot for custom content (user avatar, status, etc.) */
	rightSlot?: ReactNode
	/** Whether to show the logo text */
	showLogoText?: boolean
	/** Additional className */
	className?: string
}

/**
 * Base navigation component with consistent styling.
 * Use this as the foundation for all navigation bars.
 */
export function BaseNavigation({
	links = [],
	primaryAction,
	secondaryAction,
	rightSlot,
	showLogoText = true,
	className = ""
}: BaseNavigationProps) {
	return (
		<nav
			className={`border-b border-gray-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50 ${className}`}
		>
			<ContentContainer>
				<div className="flex justify-between items-center h-16">
					<Logo href="/" showText={showLogoText} size="sm" />

					{links.length > 0 && (
						<div className="hidden md:flex items-center space-x-8">
							{links.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className={
										link.isActive
											? "text-white font-medium"
											: "text-gray-300 hover:text-white transition-colors"
									}
								>
									{link.label}
								</Link>
							))}
						</div>
					)}

					<div className="flex items-center space-x-4">
						{secondaryAction && (
							<Button
								variant="ghost"
								className="text-gray-300 hover:text-white"
								asChild
							>
								<Link href={secondaryAction.href}>{secondaryAction.label}</Link>
							</Button>
						)}
						{primaryAction && (
							<Button
								className="bg-blue-500 hover:bg-blue-600 text-white"
								asChild
							>
								<Link href={primaryAction.href}>{primaryAction.label}</Link>
							</Button>
						)}
						{rightSlot}
					</div>
				</div>
			</ContentContainer>
		</nav>
	)
}
