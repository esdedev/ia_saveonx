import type { FooterSection } from "../types"

export const FOOTER_SECTIONS: FooterSection[] = [
	{
		id: "product",
		title: "Product",
		links: [
			{ label: "Features", href: "#features" },
			{ label: "Pricing", href: "#pricing" },
			{ label: "API", href: "#api" },
			{ label: "Documentation", href: "#documentation" }
		]
	},
	{
		id: "company",
		title: "Company",
		links: [
			{ label: "About", href: "#about" },
			{ label: "Blog", href: "#blog" },
			{ label: "Careers", href: "#careers" },
			{ label: "Contact", href: "#contact" }
		]
	},
	{
		id: "legal",
		title: "Legal",
		links: [
			{ label: "Privacy", href: "#privacy" },
			{ label: "Terms", href: "#terms" },
			{ label: "Security", href: "#security" },
			{ label: "Compliance", href: "#compliance" }
		]
	}
]
