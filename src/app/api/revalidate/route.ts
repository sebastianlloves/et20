import { revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const tags = request.nextUrl.searchParams.get('tags')?.split('_')
  tags?.forEach((tag) => revalidateTag(tag))
  console.log(tags)

  return Response.json({ revalidatedTags: tags })
}

