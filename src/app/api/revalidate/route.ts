import { revalidateTag } from 'next/cache'

export default async function GET() {
  revalidateTag('db2023')
  return Response.json({ revalidated: true })
}
