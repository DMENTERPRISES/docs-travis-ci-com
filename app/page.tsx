import Link from "next/link"

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Vercel Blob Integration Demo</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/upload" className="p-6 border rounded-lg hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">File Upload</h2>
          <p className="text-gray-600">Upload files to Vercel Blob storage</p>
        </Link>

        <Link href="/test-blob" className="p-6 border rounded-lg hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Test Integration</h2>
          <p className="text-gray-600">Test the Blob integration functionality</p>
        </Link>

        <Link href="/verify-blob" className="p-6 border rounded-lg hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Verify Setup</h2>
          <p className="text-gray-600">Run comprehensive verification tests</p>
        </Link>
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">API Endpoints</h3>
        <div className="space-y-2 text-sm">
          <div>
            <code className="bg-gray-200 px-2 py-1 rounded">POST /api/upload</code> - Upload files
          </div>
          <div>
            <code className="bg-gray-200 px-2 py-1 rounded">GET /api/test-blob</code> - Test blob listing
          </div>
          <div>
            <code className="bg-gray-200 px-2 py-1 rounded">GET /api/verify-blob/connection</code> - Test connection
          </div>
        </div>
      </div>
    </div>
  )
}
