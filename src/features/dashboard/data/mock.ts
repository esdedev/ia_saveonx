import type { TimestampRecord, UserStats } from "@/features/dashboard/types"

export const MOCK_USER_STATS: UserStats = {
	totalTimestamps: 247,
	thisMonth: 23,
	verifications: 89,
	savedCosts: "$1,247"
}

export const MOCK_RECENT_TIMESTAMPS: TimestampRecord[] = [
	{
		id: "ts_001",
		postUrl: "https://x.com/elonmusk/status/1234567890",
		author: "@elonmusk",
		content:
			"Mars mission update: We're making incredible progress on the Starship program...",
		timestampedAt: "2024-01-20T10:30:00Z",
		status: "verified",
		networks: ["ethereum", "bitcoin"],
		cost: "$2.50",
		verificationCount: 12
	},
	{
		id: "ts_002",
		postUrl: "https://x.com/openai/status/1234567891",
		author: "@openai",
		content:
			"Introducing GPT-5: The next generation of artificial intelligence...",
		timestampedAt: "2024-01-20T09:15:00Z",
		status: "verified",
		networks: ["ethereum"],
		cost: "$1.20",
		verificationCount: 8
	},
	{
		id: "ts_003",
		postUrl: "https://x.com/techcrunch/status/1234567892",
		author: "@techcrunch",
		content:
			"Breaking: Major tech acquisition announced, valued at $50 billion...",
		timestampedAt: "2024-01-20T08:45:00Z",
		status: "pending",
		networks: ["opentimestamps"],
		cost: "Free",
		verificationCount: 0
	},
	{
		id: "ts_004",
		postUrl: "https://x.com/reuters/status/1234567893",
		author: "@reuters",
		content:
			"Global climate summit reaches historic agreement on carbon emissions...",
		timestampedAt: "2024-01-19T16:20:00Z",
		status: "verified",
		networks: ["ethereum", "polygon"],
		cost: "$0.85",
		verificationCount: 15
	},
	{
		id: "ts_005",
		postUrl: "https://x.com/nasa/status/1234567894",
		author: "@nasa",
		content:
			"James Webb telescope discovers potentially habitable exoplanet...",
		timestampedAt: "2024-01-19T14:10:00Z",
		status: "failed",
		networks: [],
		cost: "$0.00",
		verificationCount: 0
	}
]
