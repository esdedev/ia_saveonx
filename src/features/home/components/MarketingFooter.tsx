import Link from "next/link"
import { Logo } from "@/features/shared/components/Logo"
import type { FooterSection } from "../types"

type MarketingFooterProps = {
	sections: FooterSection[]
}

export function MarketingFooter({ sections }: MarketingFooterProps) {
	const currentYear = new Date().getFullYear()

	return (
		<footer className="border-t border-gray-800 bg-gray-900/50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid md:grid-cols-4 gap-8">
					<div>
						<Logo className="mb-4" />
						<p className="text-gray-400">
							Preserving digital truth for the next generation of innovation.
						</p>
					</div>

					{sections.map((section) => (
						<div key={section.id}>
							<h4 className="font-bold text-white mb-4">{section.title}</h4>
							<ul className="space-y-2 text-gray-400">
								{section.links.map((link) => (
									<li key={link.href}>
										<Link
											href={link.href}
											className="hover:text-white transition-colors"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
				<div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
					<p>
						&copy; {currentYear} SaveOnX. All rights reserved. Preserving truth,
						enabling innovation. This site is unaffiliated with X Corp. (Twitter).
					</p>
				</div>
			</div>
		</footer>
	)
}
