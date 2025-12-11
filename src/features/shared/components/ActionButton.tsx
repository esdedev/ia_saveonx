"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import type { IconName } from "../../../types/shared"
import { renderIcon } from "../utils/icons"

type ActionButtonVariant = "primary" | "secondary" | "ghost" | "destructive"
type ActionButtonSize = "sm" | "md" | "lg"

interface ActionButtonProps {
	children: ReactNode
	/** Button variant determines the visual style */
	variant?: ActionButtonVariant
	/** Button size */
	size?: ActionButtonSize
	/** Optional icon to show before or after the label */
	icon?: IconName
	/** Position of the icon */
	iconPosition?: "left" | "right"
	/** Click handler */
	onClick?: () => void
	/** Disable the button */
	disabled?: boolean
	/** Show loading state */
	isLoading?: boolean
	/** Loading text (optional) */
	loadingText?: string
	/** Full width button */
	fullWidth?: boolean
	/** Render as a link */
	href?: string
	/** Additional className */
	className?: string
	/** Button type */
	type?: "button" | "submit" | "reset"
}

const VARIANT_CLASSES: Record<ActionButtonVariant, string> = {
	primary: "bg-blue-500 hover:bg-blue-600 text-white",
	secondary:
		"border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 bg-transparent",
	ghost: "text-gray-300 hover:text-white bg-transparent",
	destructive: "bg-red-500 hover:bg-red-600 text-white"
}

const SIZE_CLASSES: Record<ActionButtonSize, string> = {
	sm: "px-4 py-2 text-sm",
	md: "px-6 py-3 text-base",
	lg: "px-8 py-4 text-lg"
}

/**
 * Consistent action button with loading states and icons.
 * Use this for primary actions throughout the app.
 */
export function ActionButton({
	children,
	variant = "primary",
	size = "md",
	icon,
	iconPosition = "right",
	onClick,
	disabled = false,
	isLoading = false,
	loadingText,
	fullWidth = false,
	href,
	className = "",
	type = "button"
}: ActionButtonProps) {
	const variantClass = VARIANT_CLASSES[variant]
	const sizeClass = SIZE_CLASSES[size]
	const widthClass = fullWidth ? "w-full" : ""

	const buttonContent = (
		<>
			{isLoading && (
				<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
			)}
			{!isLoading && icon && iconPosition === "left" && (
				<span className="mr-2">{renderIcon(icon, "h-4 w-4")}</span>
			)}
			{isLoading && loadingText ? loadingText : children}
			{!isLoading && icon && iconPosition === "right" && (
				<span className="ml-2">{renderIcon(icon, "h-4 w-4")}</span>
			)}
		</>
	)

	const combinedClassName =
		`${variantClass} ${sizeClass} ${widthClass} ${className}`.trim()

	if (href && !disabled && !isLoading) {
		return (
			<Button
				variant={variant === "secondary" ? "outline" : "default"}
				className={combinedClassName}
				asChild
			>
				<a href={href}>{buttonContent}</a>
			</Button>
		)
	}

	return (
		<Button
			type={type}
			variant={variant === "secondary" ? "outline" : "default"}
			className={combinedClassName}
			onClick={onClick}
			disabled={disabled || isLoading}
		>
			{buttonContent}
		</Button>
	)
}
