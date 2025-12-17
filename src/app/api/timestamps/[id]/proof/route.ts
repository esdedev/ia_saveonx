import { and, eq, ne } from "drizzle-orm"
import { db } from "@/drizzle/db"
import { TimestampTable } from "@/drizzle/schema/timestamp"
import { getServerSession } from "@/services/auth/auth-server"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
	const session = await getServerSession()
	const { id: postId } = await params
	const row = await db.query.TimestampTable.findFirst({
		where: and(
			eq(TimestampTable.postId, postId),
			eq(TimestampTable.userId, session?.user.id || ""),
		),
	})

	if (!row?.otsBytes) {
		return new Response("Not found", { status: 404 })
	}
	const otsBytes = row.otsBytes

	return new Response(new Uint8Array(otsBytes), {
		headers: {
			"Content-Type": "application/octet-stream",
			"Content-Disposition": `attachment; filename="row.ots"`,
			"Content-Length": otsBytes.length.toString(),
			"Cache-Control": "private, max-age=0, no-store",
		},
	})
}
