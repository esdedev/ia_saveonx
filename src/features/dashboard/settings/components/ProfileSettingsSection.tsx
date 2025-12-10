import { CheckCircle, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StatusBadge } from "@/features/shared/components"

export function ProfileSettingsSection() {
	return (
		<div className="space-y-6">
			<Card className="bg-gray-900/50 border-gray-700">
				<CardHeader>
					<CardTitle className="text-white">Profile Information</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<Label htmlFor="firstName" className="text-gray-300">
								First Name
							</Label>
							<Input
								id="firstName"
								defaultValue="John"
								className="bg-gray-800 border-gray-600 text-white"
							/>
						</div>
						<div>
							<Label htmlFor="lastName" className="text-gray-300">
								Last Name
							</Label>
							<Input
								id="lastName"
								defaultValue="Doe"
								className="bg-gray-800 border-gray-600 text-white"
							/>
						</div>
					</div>
					<div>
						<Label htmlFor="email" className="text-gray-300">
							Email Address
						</Label>
						<Input
							id="email"
							type="email"
							defaultValue="john.doe@example.com"
							className="bg-gray-800 border-gray-600 text-white"
						/>
					</div>
					<div>
						<Label htmlFor="company" className="text-gray-300">
							Company (Optional)
						</Label>
						<Input
							id="company"
							defaultValue="Acme Corp"
							className="bg-gray-800 border-gray-600 text-white"
						/>
					</div>
					<Button className="bg-blue-500 hover:bg-blue-600 text-white">
						<Save className="h-4 w-4 mr-2" />
						Save Changes
					</Button>
				</CardContent>
			</Card>

			<Card className="bg-gray-900/50 border-gray-700">
				<CardHeader>
					<CardTitle className="text-white">Account Status</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between">
						<div>
							<div className="flex items-center space-x-2 mb-2">
								<StatusBadge label="Professional" variant="success" />
								<CheckCircle className="h-4 w-4 text-green-400" />
							</div>
							<p className="text-gray-300">Account verified and active</p>
							<p className="text-sm text-gray-400">Member since January 2024</p>
						</div>
						<Button variant="outline" className="border-gray-600 text-gray-300">
							Upgrade Plan
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
