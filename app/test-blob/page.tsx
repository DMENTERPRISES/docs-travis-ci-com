"use client"

import { useState } from "react"

export default function TestBlobPage() {
  const [testResult, setTestResult] = useState<string | null>(null)
  const [testing, setTesting] = useState(false)

  const testBlobIntegration = async () => {
    setTesting(true)
    setTestResult(null)

    try {
      // Create a simple test file
      const testContent = new Blob(["Hello, Vercel Blob!"], { type: "text/plain" })

      const response = await fetch(`/api/upload?filename=test-${Date.now()}.txt`, {
        method: "POST",
        body: testContent,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const result = await response.json()
      setTestResult(`✅ Success! Blob uploaded to: ${result.url}`)
    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Test Vercel Blob Integration</h1>

      <div className="space-y-4">
        <button
          onClick={testBlobIntegration}
          disabled={testing}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
        >
          {testing ? "Testing..." : "Test Blob Integration"}
        </button>

        {testResult && (
          <div
            className={`p-4 rounded-md ${
              testResult.includes("✅")
                ? "bg-green-100 border border-green-400 text-green-700"
                : "bg-red-100 border border-red-400 text-red-700"
            }`}
          >
            {testResult}
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-md">
        <h2 className="font-semibold mb-2">Integration Checklist:</h2>
        <ul className="space-y-1 text-sm">
          <li>✅ @vercel/blob package installed</li>
          <li>✅ BLOB_READ_WRITE_TOKEN environment variable available</li>
          <li>🔄 API route functionality (test above)</li>
        </ul>
      </div>
    </div>
  )
}
