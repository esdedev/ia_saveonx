import { adminClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { env } from "@/data/env/client"

export const authClient = createAuthClient({
	baseURL: env.NEXT_PUBLIC_APP_URL,
	plugins: [adminClient()],
})

// Export commonly used functions for convenience
export const { signIn, signUp, signOut, useSession, getSession } = authClient
