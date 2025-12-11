/**
 * Database seed script
 * Run with: pnpm tsx src/scripts/seed.ts
 */

import { db } from "@/drizzle/db"
import { PostTable, TimestampTable } from "@/drizzle/schema"
import { user } from "@/drizzle/schema/auth"
import { hashContent } from "@/lib/crypto"

async function seed() {
	console.log("🌱 Seeding database...")

	try {
		// Create a test user
		console.log("Creating test user...")
		const [testUser] = await db
			.insert(user)
			.values({
				id: crypto.randomUUID(),
				email: "demo@saveonx.com",
				name: "Demo User",
				image: "https://unavatar.io/twitter/demo",
				subscriptionTier: "pro",
				timestampsLimit: 100,
				timestampsUsedThisMonth: 5,
				xUsername: "demo_user",
			})
			.returning()

		console.log(`✓ Created user: ${testUser.email} (${testUser.id})`)

		// Create some test posts
		console.log("Creating test posts...")
		const postsData = [
			{
				xPostId: "1234567890123456789",
				xPostUrl: "https://x.com/elonmusk/status/1234567890123456789",
				authorUsername: "elonmusk",
				authorDisplayName: "Elon Musk",
				content:
					"Just launched a new feature that will change everything! 🚀 This is the future of technology. #Innovation #Tech",
				likesAtCapture: 50000,
				retweetsAtCapture: 15000,
				repliesAtCapture: 8000
			},
			{
				xPostId: "9876543210987654321",
				xPostUrl: "https://x.com/naval/status/9876543210987654321",
				authorUsername: "naval",
				authorDisplayName: "Naval",
				content:
					"Seek wealth, not money or status. Wealth is having assets that earn while you sleep.",
				likesAtCapture: 25000,
				retweetsAtCapture: 8000,
				repliesAtCapture: 500
			},
			{
				xPostId: "1111222233334444555",
				xPostUrl: "https://x.com/vloer/status/1111222233334444555",
				authorUsername: "vloer",
				authorDisplayName: "Vitalik",
				content:
					"Layer 2 scaling is the future. We're seeing incredible progress in ZK rollups this year.",
				likesAtCapture: 12000,
				retweetsAtCapture: 3000,
				repliesAtCapture: 1200
			}
		]

		const posts = []
		for (const postData of postsData) {
			const contentHash = await hashContent(postData.content)
			const [post] = await db
				.insert(PostTable)
				.values({
					userId: testUser.id,
					...postData,
					contentHash,
					postedAt: new Date(
						Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
					).toISOString()
				})
				.returning()

			posts.push(post)
			console.log(`✓ Created post: ${post.xPostId}`)
		}

		// Create timestamps for posts
		console.log("Creating timestamps...")
		const blockchains = ["ethereum", "polygon", "base"]

		for (let i = 0; i < posts.length; i++) {
			const post = posts[i]
			const blockchain = blockchains[i % blockchains.length]

			const mockTxHash = `0x${Array.from({ length: 64 }, () =>
				Math.floor(Math.random() * 16).toString(16)
			).join("")}`

			const [timestamp] = await db
				.insert(TimestampTable)
				.values({
					userId: testUser.id,
					postId: post.id,
					blockchain,
					contentHash: post.contentHash,
					status: "confirmed",
					transactionHash: mockTxHash,
					blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
					blockHash: `0x${Array.from({ length: 64 }, () =>
						Math.floor(Math.random() * 16).toString(16)
					).join("")}`,
					explorerUrl: `https://${blockchain === "ethereum" ? "etherscan.io" : blockchain === "polygon" ? "polygonscan.com" : "basescan.org"}/tx/${mockTxHash}`,
					confirmations: 12,
					confirmedAt: new Date().toISOString()
				})
				.returning()

			console.log(`✓ Created timestamp on ${blockchain}: ${timestamp.id}`)
		}

		console.log("\n✅ Seed completed successfully!")
		console.log(`
📊 Summary:
- 1 user created
- ${posts.length} posts created
- ${posts.length} timestamps created

🔑 Test user credentials:
- Email: demo@saveonx.com
- User ID: ${testUser.id}
		`)
	} catch (error) {
		console.error("❌ Seed failed:", error)
		process.exit(1)
	}
}

seed()
