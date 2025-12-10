"use client"

import { Twitter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { UseCaseHighlight } from "../types"
import { getIconByName } from "../utils/icons"

type UseCasesSectionProps = {
	useCases: UseCaseHighlight[]
}

export function UseCasesSection({ useCases }: UseCasesSectionProps) {
	return (
		<section id="verify" className="py-24">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl font-bold mb-6">
						Empowering
						<span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
							{" "}
							Innovation
						</span>
					</h2>
					<p className="text-xl text-gray-300 max-w-3xl mx-auto">
						From newsrooms to boardrooms, SaveOnX is revolutionizing how truth
						is preserved and verified.
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-12 items-center">
					<div>
						<div className="space-y-8">
							{useCases.map((useCase) => {
								const accent = getUseCaseAccent(useCase.accent)
								const Icon = getIconByName(useCase.icon)
								return (
									<div key={useCase.id} className="flex items-start space-x-4">
										<div
											className={`${accent.wrapper} flex items-center justify-center shrink-0 mt-1`}
										>
											{Icon ? <Icon className={accent.icon} /> : null}
										</div>
										<div>
											<h3 className="text-xl font-bold mb-2 text-white">
												{useCase.title}
											</h3>
											<p className="text-gray-300">{useCase.description}</p>
										</div>
									</div>
								)
							})}
						</div>
					</div>

					<div className="relative">
						<div className="bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-8 border border-gray-700">
							<div className="bg-black rounded-lg p-6 border border-gray-600">
								<div className="flex items-center space-x-3 mb-4">
									<div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
										<Twitter className="h-5 w-5 text-white" />
									</div>
									<div>
										<div className="font-bold text-white">
											@company_official
										</div>
										<div className="text-sm text-gray-400">2 hours ago</div>
									</div>
								</div>
								<p className="text-white mb-4">
									"We're excited to announce our new product launch next month!
									This will revolutionize the industry. #Innovation #TechNews"
								</p>
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4 text-gray-400 text-sm">
										<span>💬 24</span>
										<span>🔄 156</span>
										<span>❤️ 892</span>
									</div>
									<Badge className="bg-green-500/20 text-green-400 border-green-500/30">
										✓ Timestamped
									</Badge>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

function getUseCaseAccent(accent: UseCaseHighlight["accent"]) {
	switch (accent) {
		case "blue":
			return {
				wrapper: "w-8 h-8 bg-blue-500/20 rounded-lg",
				icon: "h-4 w-4 text-blue-400"
			}
		case "purple":
			return {
				wrapper: "w-8 h-8 bg-purple-500/20 rounded-lg",
				icon: "h-4 w-4 text-purple-400"
			}
		case "green":
			return {
				wrapper: "w-8 h-8 bg-green-500/20 rounded-lg",
				icon: "h-4 w-4 text-green-400"
			}
		default:
			return {
				wrapper: "w-8 h-8 bg-gray-500/20 rounded-lg",
				icon: "h-4 w-4 text-gray-400"
			}
	}
}
