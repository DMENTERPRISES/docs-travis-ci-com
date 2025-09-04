"use client"

import type React from "react"

import { useState } from "react"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    setUploadedUrl(null)
    setError(null)

    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const blob = await response.json()
      setUploadedUrl(blob.url)
    } catch (error) {
      console.error("Error uploading file:", error)
      setError(error instanceof Error ? error.message : "Unknown error occurred")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Upload to Vercel Blob</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full" />
        </div>

        <button
          type="submit"
          disabled={!file || uploading}
          className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <strong>Error:</strong> {error}
        </div>
      )}

      {uploadedUrl && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Uploaded File:</h2>
          <div className="p-4 bg-gray-100 rounded-md">
            <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 break-all">
              {uploadedUrl}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
