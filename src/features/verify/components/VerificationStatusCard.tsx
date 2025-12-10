import {
	AlertTriangle,
	CheckCircle,
	Clock,
	ExternalLink,
	Key,
	Shield,
	XCircle
} from "lucide-react"
import type { ChangeEvent } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type {
	DigitalSignatureSettings,
	VerificationResult,
	WatermarkSettings
} from "@/features/verify/types"

interface VerificationStatusCardProps {
	result: VerificationResult
	digitalSignatureSettings: DigitalSignatureSettings
	watermarkSettings: WatermarkSettings
	showSignatureSettings: boolean
	showWatermarkSettings: boolean
	onToggleSignatureSettings: () => void
	onToggleWatermarkSettings: () => void
	onDigitalSignatureSettingsChange: (settings: DigitalSignatureSettings) => void
	onWatermarkSettingsChange: (settings: WatermarkSettings) => void
	onExport: () => void
	onOpenPost: () => void
}

export function VerificationStatusCard({
	result,
	digitalSignatureSettings,
	watermarkSettings,
	showSignatureSettings,
	showWatermarkSettings,
	onToggleSignatureSettings,
	onToggleWatermarkSettings,
	onDigitalSignatureSettingsChange,
	onWatermarkSettingsChange,
	onExport,
	onOpenPost
}: VerificationStatusCardProps) {
	return (
		<Card className="bg-gray-900/50 border-gray-700">
			<CardHeader>
				<CardTitle className="text-white flex items-center justify-between">
					<span className="flex items-center space-x-2">
						{result.isTimestamped ? (
							<CheckCircle className="h-6 w-6 text-green-400" />
						) : (
							<XCircle className="h-6 w-6 text-red-400" />
						)}
						<span>Verification Status</span>
					</span>
					<div className="flex items-center space-x-2">
						{digitalSignatureSettings.enabled && (
							<Badge className="bg-green-500/20 text-green-400 border-green-500/30">
								<Key className="h-3 w-3 mr-1" />
								Digitally Signed
							</Badge>
						)}
						<Badge
							className={
								result.isTimestamped
									? "bg-green-500/20 text-green-400 border-green-500/30"
									: "bg-red-500/20 text-red-400 border-red-500/30"
							}
						>
							{result.isTimestamped ? "✓ Timestamped" : "✗ Not Found"}
						</Badge>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{result.isTimestamped ? (
					<TimestampedDetails result={result} onOpenPost={onOpenPost} />
				) : (
					<MissingPostState />
				)}

				<div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
					<div className="flex items-center space-x-2 text-sm text-gray-400">
						<Shield className="h-4 w-4" />
						<span>Cryptographically verified and tamper-proof</span>
						{digitalSignatureSettings.enabled && (
							<>
								<span>•</span>
								<Key className="h-4 w-4" />
								<span>Digitally signed</span>
							</>
						)}
					</div>
					<Button
						onClick={onExport}
						variant="outline"
						className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
					>
						Export Signed PDF
					</Button>
				</div>

				{result.isTimestamped && (
					<div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
						<Button
							onClick={onToggleSignatureSettings}
							variant="ghost"
							size="sm"
							className="text-gray-400 hover:text-white"
						>
							<Key className="h-4 w-4 mr-2" />
							Digital Signature Settings
						</Button>

						{showSignatureSettings && (
							<DigitalSignatureSettingsPanel
								settings={digitalSignatureSettings}
								onChange={onDigitalSignatureSettingsChange}
							/>
						)}

						<Button
							onClick={onToggleWatermarkSettings}
							variant="ghost"
							size="sm"
							className="text-gray-400 hover:text-white"
						>
							<svg
								className="h-4 w-4 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>Watermark Icon</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
								/>
							</svg>
							Watermark Settings
						</Button>

						{showWatermarkSettings && (
							<WatermarkSettingsPanel
								settings={watermarkSettings}
								onChange={onWatermarkSettingsChange}
							/>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	)
}

interface TimestampedDetailsProps {
	result: VerificationResult
	onOpenPost: () => void
}

function TimestampedDetails({ result, onOpenPost }: TimestampedDetailsProps) {
	const statusBadgeClass =
		result.timestampData.status === "verified"
			? "bg-green-500/20 text-green-400 border-green-500/30"
			: result.timestampData.status === "deleted"
				? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
				: "bg-red-500/20 text-red-400 border-red-500/30"

	return (
		<div className="space-y-4">
			<div className="grid md:grid-cols-3 gap-4">
				<div className="bg-gray-800/50 rounded-lg p-4">
					<div className="flex items-center space-x-2 mb-2">
						<Clock className="h-4 w-4 text-blue-400" />
						<span className="text-sm font-medium text-gray-300">
							Timestamped
						</span>
					</div>
					<p className="text-white font-mono text-sm">
						{new Date(result.timestampData.timestampedAt).toLocaleString()}
					</p>
				</div>
				<div className="bg-gray-800/50 rounded-lg p-4">
					<div className="flex items-center space-x-2 mb-2">
						<Shield className="h-4 w-4 text-purple-400" />
						<span className="text-sm font-medium text-gray-300">Status</span>
					</div>
					<Badge className={statusBadgeClass}>
						{result.timestampData.status === "verified" && "✓ Active"}
						{result.timestampData.status === "deleted" && "⚠ Deleted"}
						{result.timestampData.status === "modified" && "⚠ Modified"}
					</Badge>
				</div>
				<div className="bg-gray-800/50 rounded-lg p-4">
					<div className="flex items-center space-x-2 mb-2">
						<ExternalLink className="h-4 w-4 text-green-400" />
						<span className="text-sm font-medium text-gray-300">
							Original Post
						</span>
					</div>
					<Button
						variant="ghost"
						size="sm"
						className="text-blue-400 hover:text-blue-300 p-0 h-auto"
						onClick={onOpenPost}
					>
						View on X
					</Button>
				</div>
			</div>

			{result.timestampData.status === "deleted" && (
				<div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
					<div className="flex items-center space-x-2 mb-2">
						<AlertTriangle className="h-5 w-5 text-yellow-400" />
						<span className="font-medium text-yellow-400">Post Deleted</span>
					</div>
					<p className="text-gray-300 text-sm">
						This post has been deleted from X, but we preserved the original
						content when it was timestamped.
					</p>
				</div>
			)}
		</div>
	)
}

function MissingPostState() {
	return (
		<div className="text-center py-8">
			<XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
			<h3 className="text-xl font-bold text-white mb-2">Post Not Found</h3>
			<p className="text-gray-300 mb-6">
				This post hasn't been timestamped yet. Would you like to preserve it
				now?
			</p>
			<Button className="bg-blue-500 hover:bg-blue-600 text-white">
				Timestamp This Post
			</Button>
		</div>
	)
}

interface DigitalSignatureSettingsPanelProps {
	settings: DigitalSignatureSettings
	onChange: (settings: DigitalSignatureSettings) => void
}

function DigitalSignatureSettingsPanel({
	settings,
	onChange
}: DigitalSignatureSettingsPanelProps) {
	const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = event.target

		if (name === "enabled") {
			onChange({ ...settings, enabled: checked })
		} else if (name === "includeTimestamp") {
			onChange({ ...settings, includeTimestamp: checked })
		} else if (name === "showPublicKey") {
			onChange({ ...settings, showPublicKey: checked })
		}
	}

	const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = event.target

		if (name === "algorithm") {
			onChange({
				...settings,
				algorithm: value as DigitalSignatureSettings["algorithm"]
			})
		} else if (name === "signatureLevel") {
			onChange({
				...settings,
				signatureLevel: value as DigitalSignatureSettings["signatureLevel"]
			})
		}
	}

	return (
		<div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
			<div className="flex items-center space-x-3">
				<input
					type="checkbox"
					id="signature-enabled"
					name="enabled"
					checked={settings.enabled}
					onChange={handleCheckboxChange}
					className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
				/>
				<Label htmlFor="signature-enabled" className="text-gray-300">
					Enable digital signatures
				</Label>
			</div>

			{settings.enabled && (
				<>
					<div>
						<Label className="text-gray-300 mb-2 block">
							Signature Algorithm
						</Label>
						<select
							name="algorithm"
							value={settings.algorithm}
							onChange={handleSelectChange}
							className="w-full bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2"
						>
							<option value="RSA-SHA256">RSA with SHA-256 (Recommended)</option>
							<option value="ECDSA-SHA256">ECDSA with SHA-256</option>
							<option value="EdDSA">EdDSA (Ed25519)</option>
						</select>
					</div>

					<div>
						<Label className="text-gray-300 mb-2 block">Signature Level</Label>
						<select
							name="signatureLevel"
							value={settings.signatureLevel}
							onChange={handleSelectChange}
							className="w-full bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2"
						>
							<option value="basic">Basic Electronic Signature</option>
							<option value="advanced">Advanced Electronic Signature</option>
							<option value="qualified">Qualified Electronic Signature</option>
						</select>
					</div>

					<div className="flex items-center space-x-3">
						<input
							type="checkbox"
							id="include-timestamp"
							name="includeTimestamp"
							checked={settings.includeTimestamp}
							onChange={handleCheckboxChange}
							className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
						/>
						<Label htmlFor="include-timestamp" className="text-gray-300">
							Include trusted timestamp
						</Label>
					</div>

					<div className="flex items-center space-x-3">
						<input
							type="checkbox"
							id="show-public-key"
							name="showPublicKey"
							checked={settings.showPublicKey}
							onChange={handleCheckboxChange}
							className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
						/>
						<Label htmlFor="show-public-key" className="text-gray-300">
							Include public key in document
						</Label>
					</div>

					<div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
						<div className="flex items-center space-x-2 mb-2">
							<Key className="h-4 w-4 text-blue-400" />
							<span className="font-medium text-blue-400 text-sm">
								Digital Signature Benefits
							</span>
						</div>
						<ul className="text-xs text-gray-300 space-y-1">
							<li>
								• <strong>Non-repudiation:</strong> Proves document origin
							</li>
							<li>
								• <strong>Integrity:</strong> Detects any document modifications
							</li>
							<li>
								• <strong>Authentication:</strong> Verifies signer identity
							</li>
							<li>
								• <strong>Legal validity:</strong> Admissible in court
								proceedings
							</li>
						</ul>
					</div>
				</>
			)}
		</div>
	)
}

interface WatermarkSettingsPanelProps {
	settings: WatermarkSettings
	onChange: (settings: WatermarkSettings) => void
}

function WatermarkSettingsPanel({
	settings,
	onChange
}: WatermarkSettingsPanelProps) {
	const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = event.target

		if (name === "enabled") {
			onChange({ ...settings, enabled: checked })
		} else if (name === "useCustom") {
			onChange({ ...settings, useCustom: checked })
		}
	}

	const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
		onChange({
			...settings,
			position: event.target.value as WatermarkSettings["position"]
		})
	}

	const handleOpacityChange = (event: ChangeEvent<HTMLInputElement>) => {
		onChange({
			...settings,
			opacity: Number.parseFloat(event.target.value)
		})
	}

	const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
		onChange({
			...settings,
			customText: event.target.value
		})
	}

	return (
		<div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
			<div className="flex items-center space-x-3">
				<input
					type="checkbox"
					id="watermark-enabled"
					name="enabled"
					checked={settings.enabled}
					onChange={handleCheckboxChange}
					className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
				/>
				<Label htmlFor="watermark-enabled" className="text-gray-300">
					Enable watermark
				</Label>
			</div>

			{settings.enabled && (
				<>
					<div>
						<Label className="text-gray-300 mb-2 block">
							Watermark Position
						</Label>
						<select
							name="position"
							value={settings.position}
							onChange={handleSelectChange}
							className="w-full bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2"
						>
							<option value="diagonal">Diagonal Overlay</option>
							<option value="background">Background Pattern</option>
							<option value="footer">Footer Only</option>
						</select>
					</div>

					<div>
						<Label className="text-gray-300 mb-2 block">Opacity</Label>
						<input
							type="range"
							min="0.05"
							max="0.3"
							step="0.05"
							value={settings.opacity}
							onChange={handleOpacityChange}
							className="w-full"
						/>
						<div className="text-xs text-gray-400 mt-1">
							{Math.round(settings.opacity * 100)}% opacity
						</div>
					</div>

					<div className="flex items-center space-x-3">
						<input
							type="checkbox"
							id="custom-watermark"
							name="useCustom"
							checked={settings.useCustom}
							onChange={handleCheckboxChange}
							className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
						/>
						<Label htmlFor="custom-watermark" className="text-gray-300">
							Use custom watermark text
						</Label>
					</div>

					{settings.useCustom && (
						<div>
							<Label className="text-gray-300 mb-2 block">
								Custom Watermark Text
							</Label>
							<input
								type="text"
								value={settings.customText}
								onChange={handleTextChange}
								placeholder="Enter custom watermark text"
								className="w-full bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2"
							/>
						</div>
					)}

					<div className="text-xs text-gray-400">
						<p className="mb-1">
							Preview:{" "}
							<span className="font-mono text-gray-300">
								{settings.useCustom && settings.customText
									? settings.customText
									: settings.text}
							</span>
						</p>
						<p>
							Watermarks provide authenticity verification and brand protection
							for your reports.
						</p>
					</div>
				</>
			)}
		</div>
	)
}
