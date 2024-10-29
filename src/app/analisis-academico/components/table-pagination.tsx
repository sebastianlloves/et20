import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { getPagesNumbers } from '@/lib/utils'
import { SearchParams } from '../page'

interface TablePaginationProps {
  paginationUtils: {
    currentPage: number
    lastPage: number
    indexFirstElement?: number
    indexLastElement?: number
    totalSize?: number
  }
  searchParams: SearchParams
}

function TablePagination({
  paginationUtils,
  searchParams,
}: TablePaginationProps) {
  const {
    currentPage,
    lastPage,
    indexFirstElement,
    indexLastElement,
    totalSize,
  } = paginationUtils
  const pagesButtons = getPagesNumbers(currentPage, lastPage)
  const getPageLink = (pageNumber: number) => {
    return { ...searchParams, page: [pageNumber, lastPage].join('_') }
  }

  return (
    <div className="relative col-start-2 flex items-center justify-center">
      <div className="absolute left-4 w-fit justify-self-start">
        {totalSize === undefined ? (
          <Skeleton className="h-3 w-56 rounded-full bg-muted-foreground/20" />
        ) : (
          totalSize > 0 && (
            <p className="text-sm">
              {`Mostrando ${indexFirstElement}-${indexLastElement} de`}{' '}
              <span className='font-medium'>{` ${totalSize}`}</span> {'resultados'}
            </p>
          )
        )}
      </div>
      <Pagination className="w-fit">
        <PaginationContent>
          <PaginationPrevious
            href={{
              pathname: '/analisis-academico',
              query: getPageLink(currentPage - 1),
            }}
            isDisabled={currentPage === 1 || !pagesButtons.length}
            className="mr-2"
          />
          {pagesButtons.length > 0 ? (
            pagesButtons.map((buttonNumber, index) => (
              <>
                <PaginationLink
                  key={buttonNumber}
                  href={{
                    pathname: '/analisis-academico',
                    query: getPageLink(buttonNumber),
                  }}
                  isActive={buttonNumber === currentPage}
                >
                  {buttonNumber}
                </PaginationLink>
                {pagesButtons[index + 1] - buttonNumber > 1 && (
                  <PaginationEllipsis />
                )}
              </>
            ))
          ) : (
            <Skeleton className="h-6 w-52 rounded-md bg-muted-foreground/15" />
          )}
          <PaginationNext
            href={{
              pathname: '/analisis-academico',
              query: getPageLink(currentPage + 1),
            }}
            isDisabled={currentPage === lastPage || !pagesButtons.length}
            className="ml-2"
          />
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default TablePagination
