import { fetchStudentsData } from '@/lib/data'
import { Suspense } from 'react'
import StudentsTable from './students-table'
import { columns } from './columns'

export default async function Home () {
  const data = await fetchStudentsData()

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <StudentsTable columns={columns} data={data} />
    </Suspense>
  )
}
