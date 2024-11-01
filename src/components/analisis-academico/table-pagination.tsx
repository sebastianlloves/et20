import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { SearchParams } from '../../app/analisis-academico/page'
import { getPagesNumbers } from '@/lib/utils'

interface TablePaginationProps {
  paginationUtils: {
    currentPage: number | null
    lastPage: number | null
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
  const getPageQuery = (pageNumber: number | string) => {
    return { ...searchParams, page: [pageNumber, lastPage].join('_') }
  }

  return (
    <div className="relative my-0 flex flex-col items-center justify-end gap-y-1 px-2 md:flex-row lg:col-start-2 xl:px-4">
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
              query: currentPage ? getPageQuery(currentPage - 1) : '',
            }}
            isDisabled={currentPage === 1 || !pagesButtons.length}
            className="mr-1 h-7 px-3 py-0 text-xs lg:mr-2 lg:h-9 lg:px-4 lg:text-sm"
          />
          {currentPage && lastPage ? (
            pagesButtons.map((buttonNumber, index) =>
              buttonNumber !== '...' ? (
                <PaginationLink
                  key={index}
                  href={{
                    pathname: '/analisis-academico',
                    query: getPageQuery(buttonNumber),
                  }}
                  isActive={buttonNumber === currentPage}
                  className="h-7 w-7 text-xs lg:h-9 lg:w-9 lg:text-sm"
                >
                  {buttonNumber}
                </PaginationLink>
              ) : (
                <PaginationEllipsis
                  key={index}
                  className="h-7 w-7 lg:h-9 lg:w-9"
                />
              ),
            )
          ) : (
            <div className="flex w-full items-center gap-1">
              {Array.from({ length: 7 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-7 w-7 rounded-md bg-muted-foreground/15 lg:h-9 lg:w-9"
                />
              ))}
            </div>
          )}
          <PaginationNext
            href={{
              pathname: '/analisis-academico',
              query: currentPage ? getPageQuery(currentPage + 1) : '',
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
