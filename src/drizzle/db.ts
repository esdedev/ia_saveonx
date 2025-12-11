import { drizzle } from "drizzle-orm/pglite"
import * as schema from "./schema"

// PGLite database instance with schema for type-safe queries
export const db = drizzle({
	connection: { dataDir: "./database" },
	schema
})
