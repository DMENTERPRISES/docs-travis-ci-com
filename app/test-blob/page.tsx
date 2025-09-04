"use client"

import { useState } from "react"

export default function TestBlobPage() {
  const [testResult, setTestResult] = useState<string | null>(null)
  const [testing, setTesting] = useState(false)
  const [apiTests, setApiTests] = useState<{ [key: string]: string }>({})

  const testBlobIntegration = async () => {
    setTesting(true)
    setTestResult(null)
    setApiTests({})

    try {
      // Test 1: Check if we can reach the API
      setApiTests((prev) => ({ ...prev, connection: "Testing connection..." }))

      const testContent = new Blob(["Hello, Vercel Blob! Test at " + new Date().toISOString()], {
        type: "text/plain",
      })

      const response = await fetch(`/api/upload?filename=test-${Date.now()}.txt`, {
        method: "POST",
        body: testContent,
      })

      setApiTests((prev) => ({
        ...prev,
        connection: `✅ API Response: ${response.status} ${response.statusText}`,
      }))

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const result = await response.json()
      setApiTests((prev) => ({
        ...prev,
        upload: `✅ Upload successful! URL: ${result.url}`,
        blob_details: `📄 Blob size: ${result.size} bytes, Type: ${result.contentType || "N/A"}`,
      }))

      setTestResult(`✅ Success! Blob uploaded to: ${result.url}`)

      // Test 2: Try to fetch the uploaded content
      try {
        const fetchResponse = await fetch(result.url)
        const content = await fetchResponse.text()
        setApiTests((prev) => ({
          ...prev,
          fetch: `✅ Content retrieved: "${content.substring(0, 50)}${content.length > 50 ? "..." : ""}"`,
        }))
      } catch (fetchError) {
        setApiTests((prev) => ({
          ...prev,
          fetch: `⚠️ Could not fetch content: ${fetchError}`,
        }))
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error"
      setTestResult(`❌ Error: ${errorMsg}`)
      setApiTests((prev) => ({
        ...prev,
        error: `❌ ${errorMsg}`,
      }))
    } finally {
      setTesting(false)
    }
  }

  const testListAPI = async () => {
    try {
      setApiTests((prev) => ({ ...prev, list: "Testing list API..." }))

      const response = await fetch("/api/test-blob")
      const data = await response.json()

      if (data.success) {
        setApiTests((prev) => ({
          ...prev,
          list: `✅ List API works! Found ${data.blobCount} blobs`,
        }))
      } else {
        setApiTests((prev) => ({
          ...prev,
          list: `❌ List API failed: ${data.error}`,
        }))
      }
    } catch (error) {
      setApiTests((prev) => ({
        ...prev,
        list: `❌ List API error: ${error}`,
      }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Test Vercel Blob Integration</h1>

      <div className="space-y-4 mb-8">
        <button
          onClick={testBlobIntegration}
          disabled={testing}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 mr-4"
        >
          {testing ? "Testing Upload..." : "Test Upload API"}
        </button>

        <button onClick={testListAPI} className="px-4 py-2 bg-green-600 text-white rounded-md">
          Test List API
        </button>
      </div>

      {/* API Test Results */}
      {Object.keys(apiTests).length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">API Test Results:</h2>
          <div className="space-y-2">
            {Object.entries(apiTests).map(([test, result]) => (
              <div key={test} className="p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                <strong className="capitalize">{test.replace("_", " ")}:</strong> {result}
              </div>
            ))}
          </div>
        </div>
      )}

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

      <div className="mt-8 p-4 bg-gray-100 rounded-md">
        <h2 className="font-semibold mb-2">Integration Checklist:</h2>
        <ul className="space-y-1 text-sm">
          <li>✅ @vercel/blob package installed</li>
          <li>✅ BLOB_READ_WRITE_TOKEN environment variable available</li>
          <li>🔄 API route functionality (test above)</li>
          <li>🔄 File upload/download cycle (test above)</li>
        </ul>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="font-semibold mb-2">Available API Endpoints:</h3>
        <div className="text-sm space-y-1">
          <div>
            <code>POST /api/upload</code> - Upload files
          </div>
          <div>
            <code>GET /api/test-blob</code> - List and test blobs
          </div>
          <div>
            <code>GET /api/verify-blob/*</code> - Comprehensive verification
          </div>
        </div>
      </div>
    </div>
  )
}
