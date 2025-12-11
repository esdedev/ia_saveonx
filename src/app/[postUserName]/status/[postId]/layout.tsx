import { notFound } from "next/navigation"

export default async function PostPageLayout({
	params,
	children
}: {
	params: Promise<{ postUserName: string; postId: string }>
	children: React.ReactNode
}) {
	const { postUserName, postId } = await params
	const post = await getPost(postId)

	if (post == null) return notFound()
	return (
		<div>
			<p>
				PostId Layout {"->"} {postId}
			</p>
			<div>{children}</div>
		</div>
	)
}

async function getPost(postId: string) {
	return "hola"
}
