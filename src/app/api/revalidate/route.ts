import { revalidateTag } from 'next/cache'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag')
  if (tag) {
    await new Promise((resolve) => setTimeout(resolve, 360000))
    revalidateTag(tag)
    return Response.json({ revalidated: true, tag, now: Date.now() })
  }
  return Response.json({ revalidated: false, now: Date.now() })
}
