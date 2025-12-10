export function VerifyHeader() {
	return (
		<div className="text-center mb-12">
			<h1 className="text-4xl md:text-5xl font-bold mb-6">
				Verify
				<span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
					{" "}
					Truth
				</span>
			</h1>
			<p className="text-xl text-gray-300 max-w-3xl mx-auto">
				Check if an X post has been timestamped and preserved. Even if the
				original post is deleted, we can show you exactly what was said and
				when.
			</p>
		</div>
	)
}
