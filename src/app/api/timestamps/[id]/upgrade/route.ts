import { and, eq, ne } from "drizzle-orm"
import { db } from "@/drizzle/db"
import { TimestampTable } from "@/drizzle/schema/timestamp"
import { getServerSession } from "@/services/auth/auth-server"
import { read, upgrade, write } from "@lacrypta/typescript-opentimestamps"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession()
  const { id: postId} = await params
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

    const timestamp = read(new Uint8Array(otsBytes));
  
    const { timestamp: upgraded, errors } = await upgrade(timestamp as any);
  
    if (errors && errors.length > 0) {
      console.warn('Some errors occurred during upgrade:');
      for (const e of errors) console.warn(String(e));
      return new Response("Upgrade errors occurred", { status: 500 })
    }
  
    const finalBytes = write(upgraded);
    // const outPath = filePath.endsWith('.ots') ? filePath.replace(/\.ots$/, '.upgraded.ots') : `${filePath}.upgraded.ots`;
    // await fs.writeFile(outPath, Buffer.from(bytes));
    console.log(`Wrote upgraded .ots: ${finalBytes.length} bytes`);
    // Write in db new otsBytes if needed
    const [updatedRow] = await db
      .update(TimestampTable)
      .set({
        otsBytes: Buffer.from(finalBytes)
      })
      .where(and(
        eq(TimestampTable.postId, postId),
        eq(TimestampTable.userId, session?.user.id || ""),
      ))
      .returning()

    console.log("Updated OTS bytes in DB:", updatedRow)

  return new Response(new Uint8Array(finalBytes), {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="row.ots"`,
      "Content-Length": finalBytes.length.toString(),
      "Cache-Control": "private, max-age=0, no-store",
    },
  })
}