import { PageHeader } from "@/features/shared/components/PageHeader"

export function VerifyHeader() {
	return (
		<PageHeader
			title="Verify"
			highlight="Truth"
			description="Check if an X post has been timestamped and preserved. Even if the original post is deleted, we can show you exactly what was said and when."
		/>
	)
}
