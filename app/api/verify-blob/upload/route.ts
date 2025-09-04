import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const testContent = `Verification test - ${new Date().toISOString()}`
    const filename = `verification-test-${Date.now()}.txt`

    const blob = await put(filename, testContent, {
      access: "public",
    })

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: filename,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
