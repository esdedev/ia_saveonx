"use client"

import { Twitter } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import type { BadgeVariant, PostContent } from "../../../types/shared"
import { getBadgeClasses } from "../utils/styles"

interface PostPreviewCardProps {
	post: PostContent
	/** Optional badge to show (e.g., "Timestamped", "Verified") */
	badgeText?: string
	/** Badge variant for styling */
	badgeVariant?: BadgeVariant
	/** Additional className for the card container */
	className?: string
	/** Whether to show engagement stats (likes, retweets, replies) */
	showEngagement?: boolean
}

/**
 * Displays an X/Twitter post preview with consistent styling.
 * Use this across timestamp, verify, and marketing features.
 */
export function PostPreviewCard({
	post,
	badgeText,
	badgeVariant = "success",
	className = "",
	showEngagement = true
}: PostPreviewCardProps) {
	return (
		<div
			className={`bg-black rounded-lg p-6 border border-gray-600 ${className}`}
		>
			<div className="flex items-center space-x-3 mb-4">
				{post.profileImage ? (
					<Image
						src={post.profileImage}
						alt={post.author}
						width={48}
						height={48}
						className="w-12 h-12 rounded-full object-cover"
					/>
				) : (
					<div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
						<Twitter className="h-6 w-6 text-white" />
					</div>
				)}
				<div className="flex-1">
					<div className="font-bold text-white">{post.author}</div>
					<div className="text-sm text-gray-400">{post.handle}</div>
				</div>
				{post.timestamp && (
					<div className="text-sm text-gray-400">{post.timestamp}</div>
				)}
			</div>

			<p className="text-white mb-4 leading-relaxed">{post.content}</p>

			<div className="flex items-center justify-between">
				{showEngagement && (
					<div className="flex items-center space-x-6 text-gray-400 text-sm">
						<span>💬 {post.replies}</span>
						<span>🔄 {post.retweets}</span>
						<span>❤️ {post.likes}</span>
					</div>
				)}

				{badgeText && (
					<Badge className={getBadgeClasses(badgeVariant)}>
						{badgeVariant === "success" && "✓ "}
						{badgeText}
					</Badge>
				)}
			</div>
		</div>
	)
}
