import { revalidateTag } from 'next/cache'

export async function GET(request: Request) {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  const params = new URLSearchParams(request.url.split('?')[1])
  const tags = params.get('tags')?.split('_')
  tags?.forEach((tag) => revalidateTag(tag))

  return Response.json({ revalidatedTags: tags })
}
