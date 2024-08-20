import React, { Suspense } from 'react'
import SkeletonStudentsTable from './components/skeleton/skeleton-students-table'
import ToggleDB from './components/toggle-db'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4">
      <div className="grid w-full grid-cols-7 gap-x-8 gap-y-4 px-8">
        <ToggleDB />
        <div className="col-span-full col-start-2 flex items-center justify-between">
          <Suspense fallback={<SkeletonStudentsTable />}>{children}</Suspense>
        </div>
      </div>
    </div>
  )
}

export default Layout
