import { list } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await list()

    return NextResponse.json({
      success: true,
      count: result.blobs.length,
      blobs: result.blobs.slice(0, 3), // Show first 3 for verification
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
