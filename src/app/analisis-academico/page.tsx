import { fetchStudentsData } from '@/lib/data'
import StudentsTable from './components/students-table'
import { columns } from './components/columns'

export default async function Home() {
  const data = await fetchStudentsData()

  return (
    <div>
      <StudentsTable columns={columns} data={data} />
    </div>
  )
}
