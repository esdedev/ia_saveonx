import { defineConfig } from "drizzle-kit"
import { env } from "@/data/env/server"

export default defineConfig({
	out: "./src/drizzle/migrations",
	schema: "./src/drizzle/schema.ts",
	dialect: "postgresql",
	driver: "pglite",
	dbCredentials: {
		url: env.DATABASE_URL
	}
})
