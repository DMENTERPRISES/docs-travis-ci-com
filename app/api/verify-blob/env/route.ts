import { NextResponse } from "next/server"

export async function GET() {
  const hasToken = !!process.env.BLOB_READ_WRITE_TOKEN

  return NextResponse.json({
    hasToken,
    tokenLength: process.env.BLOB_READ_WRITE_TOKEN?.length || 0,
  })
}
