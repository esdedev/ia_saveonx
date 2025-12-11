import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin } from "better-auth/plugins"
import { db } from "@/drizzle/db"
import * as schema from "@/drizzle/schema/auth"

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),

	// Email & password auth
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false, // Set to true in production
	},

	// Social providers - Google & Apple
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
		apple: {
			clientId: process.env.APPLE_CLIENT_ID as string,
			clientSecret: process.env.APPLE_CLIENT_SECRET as string,
		},
	},

	// Session configuration
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // Update session every 24 hours
		cookieCache: {
			enabled: true,
			maxAge: 60 * 5, // Cache for 5 minutes
		},
	},

	// Admin plugin for user management
	plugins: [
		admin({
			defaultRole: "user",
			adminRoles: ["admin"],
		}),
	],

	// User configuration
	user: {
		additionalFields: {
			role: {
				type: "string",
				required: false,
				defaultValue: "user",
				input: false, // Don't allow users to set their own role on signup
			},
			xUsername: {
				type: "string",
				required: false,
			},
			xUserId: {
				type: "string",
				required: false,
			},
			subscriptionTier: {
				type: "string",
				required: false,
				defaultValue: "free",
			},
			timestampsUsedThisMonth: {
				type: "number",
				required: false,
				defaultValue: 0,
			},
			timestampsLimit: {
				type: "number",
				required: false,
				defaultValue: 10,
			},
		},
	},

	// Account configuration
	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ["google", "apple"],
		},
	},
})

// Export auth types for use in the app
export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user
