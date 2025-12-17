"use server"

import { readFileSync } from "node:fs"
import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { submit, write } from "@lacrypta/typescript-opentimestamps"
import { eq } from "drizzle-orm"
import { env } from "@/data/env/server"
import { db } from "@/drizzle/db"
import { TimestampTable } from "@/drizzle/schema"
import { genericHash } from "@/lib/crypto"
import { canonicalize } from "@/lib/json"
import type { XApiResponse } from "@/services/x/api-types"

export async function stampTweetMvpAction(tweetId: string) {
	const xPostResponse = await fetchTweetFromAPIMock(tweetId)
	const post = await xPostResponse.tweets.at(0)
	if (!post) {
		throw new Error(`Tweet with ID ${tweetId} not found.`)
	}
	const evidence = {
		id: post.id ?? tweetId,
		author_handle: post.author?.userName ?? null,
		created_at: post.createdAt ?? null,
		text: post.text ?? null
	}

	const canonPost = await canonicalize(evidence)
	console.log("Canonicalized Post:", canonPost)

	const ots = await stamp(canonPost, "sha256") // depende del API exacto: puede devolver bytes/objeto

	const dir = join("evidence", "post", String(tweetId))
	await mkdir(dir, { recursive: true })
	await writeFile(join(dir, "evidence.json"), canonPost, "utf8")
	const [insertOtsBytesInDb] = await db
		.update(TimestampTable)
		.set({
			otsBytes: Buffer.from(ots)
		})
		.where(eq(TimestampTable.postId, "b1c2fc6c-23ec-4cd9-b17c-a58a06756584"))
		.returning()

	console.log("Inserted OTS bytes in DB:", insertOtsBytesInDb)
	await writeFile(join(dir, "evidence.ots"), Buffer.from(ots))
	await writeFile(
		join(dir, "meta.json"),
		JSON.stringify(
			{
				tweetId,
				source: "twitterapi.io",
				capturedAt: new Date().toISOString()
			},
			null,
			2
		),
		"utf8"
	)

	return { ok: true, tweetId }
}

/**
 *  Fetch tweet data from Twitter API (mocked for testing)
 * @param tweetId
 * @returns
 */
async function fetchTweetFromAPIMock(tweetId: string): Promise<XApiResponse> {
	const mockResponse = readFileSync(
		"mocks/2000619257634394345/2000619257634394345.json",
		"utf-8"
	)
	return JSON.parse(mockResponse)
}

async function fetchTweetFromAPI(tweetId: string): Promise<XApiResponse> {
	const url = `https://api.twitterapi.io/twitter/tweets?tweet_ids=${tweetId}`
	const res = await fetch(url, {
		headers: {
			"X-API-KEY": env.TWITTER_API_KEY || ""
		}
	})

	if (!res.ok) {
		if (res.status === 400) {
			throw new Error(`Bad Request: The tweet ID ${tweetId} may be invalid.`)
		}
		throw new Error(`Error fetching tweet: ${res.statusText}`)
	}

	const json = await res.json()

	return json
}

async function stamp(
	messageHash: string,
	algorithm: "sha1" | "ripemd160" | "sha256" | "keccak256" = "sha256"
): Promise<Uint8Array> {
	const newAlg = "SHA-256"

	const hashedMessage = await genericHash(messageHash, newAlg)

	console.log(
		`Computed ${algorithm} digest: ${Buffer.from(hashedMessage).toString("hex")}`
	)

	// Submit to default calendars. `submit` returns { timestamp, errors }
	const { timestamp, errors } = await submit(
		algorithm,
		new Uint8Array(hashedMessage)
	)

	console.log("Timestamp obtained:", timestamp)

	if (errors && errors.length > 0) {
		console.warn("Some errors occurred during submission:", errors)
	}

	// Serialize timestamp to .ots
	try {
		const bytes = write(timestamp)
		return bytes
	} catch {
		throw new Error("Failed to write OTS timestamp.")
	}
}
