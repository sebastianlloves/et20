import StudentsTable from './components/students-table'
import SkeletonStudentsTable from './components/skeleton/skeleton-students-table'
import ToggleDB from './components/toggle-db'
import { Suspense } from 'react'

interface PageProps {
  searchParams?: {
    anio?: string
  }
}

export default function Page({ searchParams }: PageProps) {
  const anio = searchParams?.anio || '2024'

  return (
    <div className="grid w-full grid-cols-7 gap-x-8 gap-y-4 px-8">
      <ToggleDB />
      <div className="col-span-full col-start-2 flex items-center justify-between">
        <Suspense key={anio} fallback={<SkeletonStudentsTable />}>
          <StudentsTable anio={anio} />
        </Suspense>
      </div>
    </div>
  )
}
