'use client'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import useParamsState from '@/hooks/useParamsState'

interface TablePaginationProps {
  paginationUtils: {
    currentPage: number
    lastPage: number
    pagesButtons: number[]
  }
}

function TablePagination({ paginationUtils }: TablePaginationProps) {
  const { currentPage, lastPage, pagesButtons } = paginationUtils
  const { pathname, searchParams } = useParamsState()
  const getPageLink = (pageNumber: number) => {
    searchParams.set('page', pageNumber.toString())
    return `${pathname}?${searchParams}`
  }

  return (
    <div className="col-start-2">
      <Pagination>
        <PaginationContent>
          <PaginationPrevious
            href={getPageLink(currentPage - 1)}
            isDisabled={currentPage === 1}
            className="mr-2"
          />
          {pagesButtons.map((buttonNumber, index) => (
            <>
              <PaginationLink
                key={buttonNumber}
                href={getPageLink(buttonNumber)}
                isActive={buttonNumber === currentPage}
              >
                {buttonNumber}
              </PaginationLink>
              {pagesButtons[index + 1] - buttonNumber > 1 && (
                <PaginationEllipsis />
              )}
            </>
          ))}
          <PaginationNext
            href={getPageLink(currentPage + 1)}
            isDisabled={currentPage === lastPage}
            className="ml-2"
          />
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default TablePagination
