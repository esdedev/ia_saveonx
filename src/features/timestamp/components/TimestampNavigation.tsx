import { BaseNavigation } from "@/features/shared/components/BaseNavigation"

const NAV_LINKS = [
	{ label: "Home", href: "/" },
	{ label: "Verify", href: "/verify" },
	{ label: "Dashboard", href: "/dashboard" }
]

export function TimestampNavigation() {
	return (
		<BaseNavigation
			links={NAV_LINKS}
			secondaryAction={{ label: "Sign In", href: "/sign-in" }}
			primaryAction={{ label: "Get Started", href: "/get-started" }}
		/>
	)
}
