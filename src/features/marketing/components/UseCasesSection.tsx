"use client"

import { FeatureListItem } from "@/features/shared/components/FeatureCard"
import { PostPreviewCard } from "@/features/shared/components/PostPreviewCard"
import { SectionHeader } from "@/features/shared/components/PageHeader"
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
							{useCases.map((useCase) => (
								<FeatureListItem
									key={useCase.id}
									title={useCase.title}
									description={useCase.description}
									icon={useCase.icon}
									accent={useCase.accent}
								/>
							))}
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
