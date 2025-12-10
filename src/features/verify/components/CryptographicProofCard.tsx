import { Copy, FileCheck, Hash, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { VerificationResult } from "@/features/verify/types"

interface CryptographicProofCardProps {
	result: VerificationResult
	onCopy: (value: string) => void
	onExport: () => void
}

export function CryptographicProofCard({
	result,
	onCopy,
	onExport
}: CryptographicProofCardProps) {
	return (
		<Card className="bg-gray-900/50 border-gray-700">
			<CardHeader>
				<CardTitle className="text-white flex items-center space-x-2">
					<Hash className="h-5 w-5 text-purple-400" />
					<span>Cryptographic Proof</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div>
					<Label className="text-gray-300 mb-2 block">Blockchain Hash</Label>
					<div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg p-3">
						<code className="flex-1 text-sm font-mono text-green-400 break-all">
							{result.timestampData.blockchainHash}
						</code>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onCopy(result.timestampData.blockchainHash)}
							className="text-gray-400 hover:text-white"
						>
							<Copy className="h-4 w-4" />
						</Button>
					</div>
				</div>

				<div>
					<Label className="text-gray-300 mb-2 block">Verification Hash</Label>
					<div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg p-3">
						<code className="flex-1 text-sm font-mono text-blue-400 break-all">
							{result.timestampData.verificationHash}
						</code>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onCopy(result.timestampData.verificationHash)}
							className="text-gray-400 hover:text-white"
						>
							<Copy className="h-4 w-4" />
						</Button>
					</div>
				</div>

				<div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
					<div className="flex items-center space-x-2 mb-2">
						<Shield className="h-5 w-5 text-blue-400" />
						<span className="font-medium text-blue-400">
							Verification Instructions
						</span>
					</div>
					<p className="text-gray-300 text-sm mb-3">
						You can independently verify this timestamp using the blockchain
						hash above. This provides cryptographic proof that the content
						existed at the specified time.
					</p>
					<div className="flex space-x-3 mt-4">
						<Button
							variant="outline"
							size="sm"
							className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
						>
							View on Blockchain Explorer
						</Button>
						<Button
							onClick={onExport}
							variant="outline"
							size="sm"
							className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
						>
							<FileCheck className="h-4 w-4 mr-2" />
							Export Signed Report
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
