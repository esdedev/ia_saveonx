import { CheckCircle, LinkIcon, Network, Shield } from "lucide-react"
import type { TimestampStep } from "@/features/timestamp/types"

const isStepActive = (currentStep: TimestampStep, steps: TimestampStep[]) =>
	steps.includes(currentStep)

export function TimestampProgress({ step }: { step: TimestampStep }) {
	return (
		<div className="flex items-center justify-between mb-12 max-w-2xl mx-auto">
			<div
				className={`flex items-center space-x-3 ${isStepActive(step, ["input", "preview", "networks", "confirmation"]) ? "text-blue-400" : "text-gray-400"}`}
			>
				<div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-current bg-blue-500/20">
					<LinkIcon className="h-5 w-5" />
				</div>
				<span className="text-sm font-medium hidden sm:block">Paste URL</span>
			</div>
			<div className="flex-1 h-1 bg-gray-800 mx-2" />
			<div
				className={`flex items-center space-x-3 ${isStepActive(step, ["preview", "networks", "confirmation"]) ? "text-blue-400" : "text-gray-400"}`}
			>
				<div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-current">
					<CheckCircle className="h-5 w-5" />
				</div>
				<span className="text-sm font-medium hidden sm:block">Preview</span>
			</div>
			<div className="flex-1 h-1 bg-gray-800 mx-2" />
			<div
				className={`flex items-center space-x-3 ${isStepActive(step, ["networks", "confirmation"]) ? "text-blue-400" : "text-gray-400"}`}
			>
				<div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-current">
					<Network className="h-5 w-5" />
				</div>
				<span className="text-sm font-medium hidden sm:block">Networks</span>
			</div>
			<div className="flex-1 h-1 bg-gray-800 mx-2" />
			<div
				className={`flex items-center space-x-3 ${isStepActive(step, ["confirmation"]) ? "text-blue-400" : "text-gray-400"}`}
			>
				<div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-current">
					<Shield className="h-5 w-5" />
				</div>
				<span className="text-sm font-medium hidden sm:block">Confirm</span>
			</div>
		</div>
	)
}
