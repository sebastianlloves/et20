import { revalidateTag } from 'next/cache'

export async function GET() {
  revalidateTag('db2023')
  return Response.json({ revalidated: true })
}
