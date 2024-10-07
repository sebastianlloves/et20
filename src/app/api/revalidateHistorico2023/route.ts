import { revalidateTag } from 'next/cache'

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  revalidateTag('dbHistorico2023')
  return Response.json({ revalidatedHistorico2023: true })
}
