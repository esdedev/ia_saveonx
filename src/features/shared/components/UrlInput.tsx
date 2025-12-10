"use client"

import { Loader2, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface UrlInputProps {
	value: string
	onChange: (value: string) => void
	onSubmit?: () => void
	onClear?: () => void
	placeholder?: string
	isLoading?: boolean
	disabled?: boolean
	showSupportedFormats?: boolean
	className?: string
}

const SUPPORTED_FORMATS = [
	"https://x.com/username/status/1234567890",
	"https://twitter.com/username/status/1234567890",
	"x.com/username/status/1234567890"
]

/**
 * URL input component for X/Twitter post URLs.
 * Use this in timestamp and verify features.
 */
export function UrlInput({
	value,
	onChange,
	onSubmit,
	onClear,
	placeholder = "Paste X post URL here...",
	isLoading = false,
	disabled = false,
	showSupportedFormats = true,
	className = ""
}: UrlInputProps) {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && onSubmit && !disabled && !isLoading) {
			onSubmit()
		}
	}

	return (
		<div className={className}>
			<div className="relative">
				<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
				<Input
					type="url"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					disabled={disabled || isLoading}
					className="pl-12 pr-12 py-6 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
				/>
				{value && !isLoading && onClear && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onClear}
						className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-white"
					>
						<X className="h-4 w-4" />
					</Button>
				)}
				{isLoading && (
					<Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400 animate-spin" />
				)}
			</div>

			{showSupportedFormats && (
				<div className="mt-4 text-sm text-gray-400">
					<p className="mb-2">Supported formats:</p>
					<ul className="list-disc list-inside space-y-1 text-gray-500">
						{SUPPORTED_FORMATS.map((format) => (
							<li key={format}>{format}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}
