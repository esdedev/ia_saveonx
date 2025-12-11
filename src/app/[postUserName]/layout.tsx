import { notFound } from "next/navigation"

export default async function postUserNamePageLayout({
	params,
	children
}: {
	params: Promise<{ postUserName: string }>
	children: React.ReactNode
}) {
	const { postUserName } = await params
	const userPosts = await getUserPosts(postUserName)

	if (userPosts === null) return notFound()

	return (
		<div className="grid grid-cols-2 gap-8 container">
			<div className="py-4">
				<div className="text-lg font-semibold">{postUserName}</div>
				<p>{userPosts}</p>
			</div>
			<div className="py-4">{children}</div>
		</div>
	)
}

async function getUserPosts(postUserName: string) {
	return "Hola"
	// Simulate fetching user posts from a database or API
	// const mockUserPosts = {
	// 	john_doe: { name: "John Doe", posts: ["Post 1", "Post 2"] },
	// 	jane_smith: { name: "Jane Smith", posts: ["Post A", "Post B"] }
	// }

	// return mockUserPosts[postUserName as keyof typeof mockUserPosts] || null
}
