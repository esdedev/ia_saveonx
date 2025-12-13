import { CallToActionSection } from "@/features/home/components/CallToActionSection"
import { FeatureHighlightsSection } from "@/features/home/components/FeatureHighlightsSection"
import { MarketingHero } from "@/features/home/components/MarketingHero"
import { PricingSection } from "@/features/home/components/PricingSection"
import { UseCasesSection } from "@/features/home/components/UseCasesSection"
import { CTA_CONTENT } from "@/features/home/data/callToAction"
import { FEATURE_HIGHLIGHTS } from "@/features/home/data/featureHighlights"
import {
	HERO_BADGE,
	HERO_DESCRIPTION,
	HERO_HIGHLIGHT,
	HERO_PRIMARY_ACTION,
	HERO_SECONDARY_ACTION,
	HERO_TITLE,
	HERO_VALUE_PROPS
} from "@/features/home/data/hero"
import { PRICING_PLANS } from "@/features/home/data/pricingPlans"
import { USE_CASES } from "@/features/home/data/useCases"

export default function HomePage() {
	return (
		<>
			<MarketingHero
				badge={HERO_BADGE}
				title={HERO_TITLE}
				highlight={HERO_HIGHLIGHT}
				description={HERO_DESCRIPTION}
				primaryAction={HERO_PRIMARY_ACTION}
				secondaryAction={HERO_SECONDARY_ACTION}
				valueProps={HERO_VALUE_PROPS}
			/>
			<FeatureHighlightsSection features={FEATURE_HIGHLIGHTS} />
			<UseCasesSection useCases={USE_CASES} />
			<PricingSection plans={PRICING_PLANS} />
			<CallToActionSection content={CTA_CONTENT} />
		</>
	)
}
