import { revalidateTag } from 'next/cache'

export async function GET() {
  revalidateTag('dbHistorico2023')
  console.log('Revalidada db histórica 2023')
  return Response.json({ revalidatedHistorico2023: true })
}
