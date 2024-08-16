import { fetchStudentsData } from '@/lib/data'
import { Suspense } from 'react'

export default async function Home () {
  const data = await fetchStudentsData()

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <div className="flex flex-col items-center justify-between p-24 font-inter">
        {data}
      </div>
    </Suspense>
  )
}
