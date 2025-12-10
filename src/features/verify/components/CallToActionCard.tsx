import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function CallToActionCard() {
	return (
		<Card className="bg-linear-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30 mt-12">
			<CardContent className="text-center py-12">
				<h3 className="text-2xl font-bold text-white mb-4">
					Want to Preserve Your Own Posts?
				</h3>
				<p className="text-gray-300 mb-6 max-w-2xl mx-auto">
					Don't wait until it's too late. Start timestamping your important
					posts today and ensure they're preserved forever, even if they get
					deleted.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button className="bg-blue-500 hover:bg-blue-600 text-white">
						<Link href="/timestamp">Start Timestamping</Link>
					</Button>
					<Button
						variant="outline"
						className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-400"
					>
						Learn More
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
