import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin } from "better-auth/plugins"
import { env } from "@/data/env/server"
import { db } from "@/drizzle/db"
import * as schema from "@/drizzle/schema/user"

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			...schema,
			user: schema.UserTable,
			session: schema.SessionTable,
			account: schema.AccountTable,
			verification: schema.VerificationTable,			
		}
	}),

	// Email & password auth
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false, // Set to true in production
	},

	// Social providers - Google & Apple
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
		// apple: {
		// 	clientId: process.env.APPLE_CLIENT_ID as string,
		// 	clientSecret: process.env.APPLE_CLIENT_SECRET as string,
		// },
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
