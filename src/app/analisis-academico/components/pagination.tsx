'use client'

interface PaginationProps {
  paginationUtils: {
    firstPage: number
    currentPage: number
    lastPage: number
    canNextPage: boolean
    canPreviousPage: boolean
  }
}

function Pagination({ paginationUtils }: PaginationProps) {
  const { firstPage, currentPage, lastPage, canPreviousPage, canNextPage } =
    paginationUtils

  const pagesButtons = Array.from({ length: lastPage }, (_, index) => index + 1)
  return (
    <div>
      {JSON.stringify(paginationUtils)}
      {JSON.stringify(pagesButtons)}
    </div>
  )
}

export default Pagination
