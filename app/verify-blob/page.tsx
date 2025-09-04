"use client"

import { useState } from "react"

interface TestResult {
  step: string
  status: "pending" | "success" | "error"
  message: string
}

export default function VerifyBlobPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [testing, setTesting] = useState(false)

  const runTests = async () => {
    setTesting(true)
    setTestResults([])

    const results: TestResult[] = [
      { step: "Environment Check", status: "pending", message: "Checking environment variables..." },
      { step: "API Connection", status: "pending", message: "Testing API connection..." },
      { step: "Upload Test", status: "pending", message: "Testing file upload..." },
      { step: "List Test", status: "pending", message: "Testing blob listing..." },
    ]

    setTestResults([...results])

    // Test 1: Environment Check
    try {
      const envResponse = await fetch("/api/verify-blob/env")
      const envData = await envResponse.json()

      results[0] = {
        step: "Environment Check",
        status: envData.hasToken ? "success" : "error",
        message: envData.hasToken ? "✅ BLOB_READ_WRITE_TOKEN is available" : "❌ BLOB_READ_WRITE_TOKEN is missing",
      }
    } catch (error) {
      results[0] = {
        step: "Environment Check",
        status: "error",
        message: `❌ Error checking environment: ${error}`,
      }
    }
    setTestResults([...results])

    // Test 2: API Connection
    try {
      const apiResponse = await fetch("/api/verify-blob/connection")
      const apiData = await apiResponse.json()

      results[1] = {
        step: "API Connection",
        status: apiData.success ? "success" : "error",
        message: apiData.success ? "✅ Blob API connection successful" : `❌ ${apiData.error}`,
      }
    } catch (error) {
      results[1] = {
        step: "API Connection",
        status: "error",
        message: `❌ API connection failed: ${error}`,
      }
    }
    setTestResults([...results])

    // Test 3: Upload Test
    try {
      const uploadResponse = await fetch("/api/verify-blob/upload", { method: "POST" })
      const uploadData = await uploadResponse.json()

      results[2] = {
        step: "Upload Test",
        status: uploadData.success ? "success" : "error",
        message: uploadData.success ? `✅ Upload successful: ${uploadData.url}` : `❌ ${uploadData.error}`,
      }
    } catch (error) {
      results[2] = {
        step: "Upload Test",
        status: "error",
        message: `❌ Upload failed: ${error}`,
      }
    }
    setTestResults([...results])

    // Test 4: List Test
    try {
      const listResponse = await fetch("/api/verify-blob/list")
      const listData = await listResponse.json()

      results[3] = {
        step: "List Test",
        status: listData.success ? "success" : "error",
        message: listData.success ? `✅ Listed ${listData.count} blobs successfully` : `❌ ${listData.error}`,
      }
    } catch (error) {
      results[3] = {
        step: "List Test",
        status: "error",
        message: `❌ List failed: ${error}`,
      }
    }
    setTestResults([...results])

    setTesting(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Vercel Blob Integration Verification</h1>

      <div className="mb-6">
        <button
          onClick={runTests}
          disabled={testing}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700"
        >
          {testing ? "Running Tests..." : "Run Verification Tests"}
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Results:</h2>
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                result.status === "success"
                  ? "bg-green-50 border-green-200"
                  : result.status === "error"
                    ? "bg-red-50 border-red-200"
                    : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{result.step}</h3>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    result.status === "success"
                      ? "bg-green-100 text-green-800"
                      : result.status === "error"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {result.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{result.message}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Manual Verification Steps:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Check Vercel Dashboard → Your Project → Settings → Integrations</li>
          <li>Look for "Vercel Blob" in the integrations list</li>
          <li>Verify it shows as "Connected" or "Enabled"</li>
          <li>Check Settings → Environment Variables for BLOB_READ_WRITE_TOKEN</li>
        </ol>
      </div>
    </div>
  )
}
