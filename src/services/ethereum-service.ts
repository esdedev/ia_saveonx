/**
 * Ethereum Timestamping Service
 *
 * Provides direct on-chain timestamping on Ethereum and EVM-compatible chains.
 * This stores the content hash directly in a transaction's input data.
 */

import {
	createPublicClient,
	createWalletClient,
	type Hash,
	http,
	parseEther,
	type TransactionReceipt
} from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { type base, mainnet, polygon, sepolia } from "viem/chains"

// ============================================================================
// TYPES
// ============================================================================

export type SupportedChain = "ethereum" | "ethereum-sepolia" | "polygon"

export interface EthTimestampResult {
	success: boolean
	transactionHash?: Hash
	blockNumber?: bigint
	blockHash?: Hash
	timestamp?: Date
	explorerUrl?: string
	status: "pending" | "confirmed" | "error"
	message: string
	error?: string
	gasUsed?: bigint
	effectiveGasPrice?: bigint
}

export interface ChainConfig {
	name: string
	chain: typeof mainnet | typeof sepolia | typeof polygon | typeof base
	explorerUrl: string
	rpcUrl?: string
}

// ============================================================================
// CHAIN CONFIGURATIONS
// ============================================================================

const chainConfigs: Record<SupportedChain, ChainConfig> = {
	ethereum: {
		name: "Ethereum Mainnet",
		chain: mainnet,
		explorerUrl: "https://etherscan.io"
	},
	"ethereum-sepolia": {
		name: "Ethereum Sepolia (Testnet)",
		chain: sepolia,
		explorerUrl: "https://sepolia.etherscan.io"
	},
	polygon: {
		name: "Polygon",
		chain: polygon,
		explorerUrl: "https://polygonscan.com"
	}
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the RPC URL for a chain
 */
function getRpcUrl(chainId: SupportedChain): string {
	const envRpcs: Record<SupportedChain, string | undefined> = {
		ethereum: process.env.ETHEREUM_RPC_URL,
		"ethereum-sepolia": process.env.ETHEREUM_SEPOLIA_RPC_URL,
		polygon: process.env.POLYGON_RPC_URL
	}

	// Use environment variable if set, otherwise use default public RPC
	return envRpcs[chainId] || chainConfigs[chainId].chain.rpcUrls.default.http[0]
}

/**
 * Create a public client for reading chain data
 */
function createClient(chainId: SupportedChain) {
	const config = chainConfigs[chainId]
	return createPublicClient({
		chain: config.chain,
		transport: http(getRpcUrl(chainId))
	})
}

/**
 * Create a wallet client for sending transactions
 */
function createWallet(chainId: SupportedChain, privateKey: `0x${string}`) {
	const config = chainConfigs[chainId]
	const account = privateKeyToAccount(privateKey)

	return createWalletClient({
		account,
		chain: config.chain,
		transport: http(getRpcUrl(chainId))
	})
}

/**
 * Format content hash as transaction data
 * Prepends with a marker for identification
 */
function formatHashAsData(contentHash: string): `0x${string}` {
	// Remove 0x prefix if present
	const cleanHash = contentHash.startsWith("0x")
		? contentHash.slice(2)
		: contentHash

	// Add a prefix identifier for SaveOnX timestamps
	// "SVOX" in hex = 53564F58
	const prefix = "53564F58"

	return `0x${prefix}${cleanHash}` as `0x${string}`
}

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Create a timestamp on Ethereum by sending a transaction with the content hash
 *
 * @param contentHash - The SHA-256 hash of the content to timestamp
 * @param chainId - The chain to timestamp on
 * @returns Transaction result
 */
export async function createEthTimestamp(
	contentHash: string,
	chainId: SupportedChain = "ethereum"
): Promise<EthTimestampResult> {
	try {
		// Get the wallet private key from environment
		const privateKey = process.env.TIMESTAMP_WALLET_PRIVATE_KEY as `0x${string}`

		if (!privateKey) {
			return {
				success: false,
				status: "error",
				message: "Wallet not configured",
				error: "TIMESTAMP_WALLET_PRIVATE_KEY environment variable is not set"
			}
		}

		const walletClient = createWallet(chainId, privateKey)
		const publicClient = createClient(chainId)
		const config = chainConfigs[chainId]

		// Prepare the transaction data
		const data = formatHashAsData(contentHash)

		// Send transaction to ourselves with the hash as data
		// This is the most gas-efficient way to store data on-chain
		const hash = await walletClient.sendTransaction({
			to: walletClient.account.address, // Send to self
			value: parseEther("0"), // No value transfer
			data
		})

		// Wait for transaction confirmation
		const receipt = await publicClient.waitForTransactionReceipt({
			hash,
			confirmations: 1
		})

		if (receipt.status === "success") {
			// Get the block to get the timestamp
			const block = await publicClient.getBlock({
				blockNumber: receipt.blockNumber
			})

			return {
				success: true,
				transactionHash: hash,
				blockNumber: receipt.blockNumber,
				blockHash: receipt.blockHash,
				timestamp: new Date(Number(block.timestamp) * 1000),
				explorerUrl: `${config.explorerUrl}/tx/${hash}`,
				status: "confirmed",
				message: `Timestamp confirmed on ${config.name}`,
				gasUsed: receipt.gasUsed,
				effectiveGasPrice: receipt.effectiveGasPrice
			}
		} else {
			return {
				success: false,
				transactionHash: hash,
				status: "error",
				message: "Transaction failed",
				error: "Transaction was reverted"
			}
		}
	} catch (error) {
		console.error("Ethereum timestamp error:", error)
		return {
			success: false,
			status: "error",
			message: "Failed to create Ethereum timestamp",
			error: error instanceof Error ? error.message : "Unknown error"
		}
	}
}

/**
 * Verify a timestamp transaction on the blockchain
 *
 * @param transactionHash - The transaction hash to verify
 * @param contentHash - The expected content hash
 * @param chainId - The chain to check
 * @returns Verification result
 */
export async function verifyEthTimestamp(
	transactionHash: Hash,
	contentHash: string,
	chainId: SupportedChain = "ethereum"
): Promise<{
	verified: boolean
	timestamp?: Date
	blockNumber?: bigint
	message: string
	error?: string
}> {
	try {
		const publicClient = createClient(chainId)

		// Get the transaction
		const tx = await publicClient.getTransaction({ hash: transactionHash })

		if (!tx) {
			return {
				verified: false,
				message: "Transaction not found",
				error: "The transaction does not exist on this chain"
			}
		}

		// Check if the transaction data contains our hash
		const expectedData = formatHashAsData(contentHash)

		if (tx.input.toLowerCase() !== expectedData.toLowerCase()) {
			return {
				verified: false,
				message: "Hash mismatch",
				error: "The transaction data does not match the expected content hash"
			}
		}

		if (!tx.blockNumber) {
			return {
				verified: false,
				message: "Transaction is still pending confirmation",
				error: "Transaction not yet mined"
			}
		}

		// Get block timestamp
		const block = await publicClient.getBlock({ blockNumber: tx.blockNumber })

		return {
			verified: true,
			timestamp: new Date(Number(block.timestamp) * 1000),
			blockNumber: tx.blockNumber,
			message: `Verified! Content existed before ${new Date(Number(block.timestamp) * 1000).toISOString()}`
		}
	} catch (error) {
		console.error("Ethereum verify error:", error)
		return {
			verified: false,
			message: "Verification failed",
			error: error instanceof Error ? error.message : "Unknown error"
		}
	}
}

/**
 * Get transaction details
 */
export async function getTransactionDetails(
	transactionHash: Hash,
	chainId: SupportedChain = "ethereum"
): Promise<{
	exists: boolean
	blockNumber?: bigint
	timestamp?: Date
	confirmations?: number
	status?: "pending" | "confirmed" | "failed"
}> {
	try {
		const publicClient = createClient(chainId)

		const tx = await publicClient.getTransaction({ hash: transactionHash })

		if (!tx) {
			return { exists: false }
		}

		if (!tx.blockNumber) {
			return {
				exists: true,
				status: "pending"
			}
		}

		const [block, latestBlock, receipt] = await Promise.all([
			publicClient.getBlock({ blockNumber: tx.blockNumber }),
			publicClient.getBlockNumber(),
			publicClient.getTransactionReceipt({ hash: transactionHash })
		])

		return {
			exists: true,
			blockNumber: tx.blockNumber,
			timestamp: new Date(Number(block.timestamp) * 1000),
			confirmations: Number(latestBlock - tx.blockNumber),
			status: receipt.status === "success" ? "confirmed" : "failed"
		}
	} catch (error) {
		console.error("Get transaction details error:", error)
		return { exists: false }
	}
}

/**
 * Estimate the gas cost for a timestamp transaction
 */
export async function estimateTimestampCost(
	chainId: SupportedChain = "ethereum"
): Promise<{
	gasLimit: bigint
	gasPrice: bigint
	estimatedCostWei: bigint
	estimatedCostEth: string
}> {
	const publicClient = createClient(chainId)

	// Gas for a simple data transaction is approximately 21000 + 16 per byte
	// Our data is ~36 bytes (4 byte prefix + 32 byte hash)
	const gasLimit = BigInt(21000) + BigInt(16) * BigInt(36) // ~21576

	const gasPrice = await publicClient.getGasPrice()
	const estimatedCostWei = gasLimit * gasPrice

	return {
		gasLimit,
		gasPrice,
		estimatedCostWei,
		estimatedCostEth: (Number(estimatedCostWei) / 1e18).toFixed(8)
	}
}

/**
 * Get supported chains info
 */
export function getSupportedChains(): Array<{
	id: SupportedChain
	name: string
	explorerUrl: string
}> {
	return Object.entries(chainConfigs).map(([id, config]) => ({
		id: id as SupportedChain,
		name: config.name,
		explorerUrl: config.explorerUrl
	}))
}
