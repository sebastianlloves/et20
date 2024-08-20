import StudentsTable from '../students-table'
import { skeletonColumns } from './skeleton-columns'

function SkeletonStudentsTable() {
  const skeletonData = Array(30).fill({})

  return <StudentsTable columns={skeletonColumns} data={skeletonData} />
}

export default SkeletonStudentsTable
