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
import { SearchParams } from '../../app/analisis-academico/page'

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
    <div className="relative -mt-2 flex flex-col items-center justify-end gap-y-1 px-2 md:flex-row lg:col-start-2 xl:px-4">
      <div className="left-2 flex h-8 w-fit items-center self-start md:absolute md:self-center lg:left-4 lg:h-10">
        {totalSize === undefined ? (
          <Skeleton className="h-3 w-56 rounded-full bg-muted-foreground/20" />
        ) : (
          totalSize > 0 && (
            <p className="text-xs text-foreground/90 lg:text-sm">
              <span className="hidden xl:inline">{'Mostrando '}</span>
              {`${indexFirstElement}-${indexLastElement} de`}{' '}
              <span className="font-medium">{` ${totalSize}`}</span>{' '}
              {'resultados'}
            </p>
          )
        )}
      </div>
      <Pagination className="mx-0 w-fit">
        <PaginationContent>
          <PaginationPrevious
            href={{
              pathname: '/analisis-academico',
              query: getPageLink(currentPage - 1),
            }}
            isDisabled={currentPage === 1 || !pagesButtons.length}
            className="mr-1 h-7 px-3 py-0 text-xs lg:mr-2 lg:h-9 lg:px-4 lg:text-sm"
          />
          {pagesButtons.length > 0 ? (
            pagesButtons.map((buttonNumber, index) => (
              <>
                <PaginationLink
                  key={index}
                  href={{
                    pathname: '/analisis-academico',
                    query: getPageLink(buttonNumber),
                  }}
                  isActive={buttonNumber === currentPage}
                  className="h-7 w-7 text-xs lg:h-9 lg:w-9 lg:text-sm"
                >
                  {buttonNumber}
                </PaginationLink>
                {pagesButtons[index + 1] - buttonNumber > 1 && (
                  <PaginationEllipsis className="h-7 w-7 lg:h-9 lg:w-9" />
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
            className="ml-1 text-xs lg:ml-2 lg:text-sm"
          />
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default TablePagination
