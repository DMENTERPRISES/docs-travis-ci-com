import { list } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Simple connection test - just try to list blobs
    await list({ limit: 1 })

    return NextResponse.json({
      success: true,
      message: "Successfully connected to Vercel Blob",
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
