"use client"

import { PostPreviewCard, SectionHeader } from "@/features/shared/components"
import { getIconByName, getSmallIconStyles } from "@/features/shared/utils"
import type { UseCaseHighlight } from "../types"

type UseCasesSectionProps = {
	useCases: UseCaseHighlight[]
}

export function UseCasesSection({ useCases }: UseCasesSectionProps) {
	return (
		<section id="verify" className="py-24">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<SectionHeader
					title="Empowering"
					highlight="Innovation"
					description="From newsrooms to boardrooms, SaveOnX is revolutionizing how truth is preserved and verified."
				/>

				<div className="grid md:grid-cols-2 gap-12 items-center">
					<div>
						<div className="space-y-8">
							{useCases.map((useCase) => {
								const styles = getSmallIconStyles(useCase.accent)
								const Icon = getIconByName(useCase.icon)
								return (
									<div key={useCase.id} className="flex items-start space-x-4">
										<div
											className={`${styles.wrapper} flex items-center justify-center shrink-0 mt-1`}
										>
											{Icon ? <Icon className={styles.icon} /> : null}
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
							<PostPreviewCard
								post={{
									author: "Company Official",
									handle: "@company_official",
									timestamp: "2 hours ago",
									content:
										'"We\'re excited to announce our new product launch next month! This will revolutionize the industry. #Innovation #TechNews"',
									replies: 24,
									retweets: 156,
									likes: 892
								}}
								badgeText="Timestamped"
								badgeVariant="success"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
