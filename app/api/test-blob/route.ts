import { put, list } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Test listing blobs
    const { blobs } = await list()

    return NextResponse.json({
      success: true,
      message: "Blob integration is working!",
      blobCount: blobs.length,
      blobs: blobs.slice(0, 5), // Show first 5 blobs
    })
  } catch (error) {
    console.error("Blob test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    // Test uploading a simple blob
    const testContent = "Test content from API route"
    const blob = await put(`test-${Date.now()}.txt`, testContent, {
      access: "public",
    })

    return NextResponse.json({
      success: true,
      message: "Test blob uploaded successfully!",
      blob,
    })
  } catch (error) {
    console.error("Blob upload test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
