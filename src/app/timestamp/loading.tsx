import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function TimestampLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16" />
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="h-12 bg-gray-800 rounded-lg w-64 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-gray-800 rounded-lg w-96 mx-auto animate-pulse" />
        </div>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <div className="h-8 bg-gray-800 rounded-lg w-32 animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-12 bg-gray-800 rounded-lg animate-pulse" />
            <div className="h-24 bg-gray-800 rounded-lg animate-pulse" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
