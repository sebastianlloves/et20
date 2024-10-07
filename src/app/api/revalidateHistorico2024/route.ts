import { revalidateTag } from 'next/cache'

export async function GET() {
  revalidateTag('dbHistorico2024')
  console.log('Revalidada db histórica 2024')
  return Response.json({ revalidatedHistorico2024: true })
}
