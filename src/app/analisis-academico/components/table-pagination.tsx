import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { SearchParams } from '../utils/definitions'

interface TablePaginationProps {
  paginationUtils: {
    currentPage: number | null
    lastPage: number | null
    indexFirstElement: number | null
    indexLastElement: number | null
    totalSize: number | null
    pagesButtons: (string | number | null)[]
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
    pagesButtons,
  } = paginationUtils
  const getPageQuery = (pageNumber: number | string) => {
    return { ...searchParams, page: [pageNumber, lastPage].join('_') }
  }

  return (
    <div className="my-0 flex flex-col items-center justify-between gap-y-2.5 md:flex-row lg:col-start-2 xl:px-4">
      <div className="flex h-6 w-fit shrink-0 items-center self-start align-middle sm:h-9">
        {totalSize === null ? (
          <Skeleton className="h-3 w-56 rounded-full bg-muted-foreground/20" />
        ) : (
          totalSize > 0 && (
            <p className="text-xs text-foreground/90 xl:text-sm">
              <span className="inline lg:hidden xl:inline">{'Mostrando '}</span>
              {`${indexFirstElement}-${indexLastElement} de`}{' '}
              <span className="font-medium">{` ${totalSize}`}</span>{' '}
              {'resultados'}
            </p>
          )
        )}
      </div>
      <Pagination className="mx-0 w-fit">
        <PaginationContent className="w-full">
          <PaginationPrevious
            href={{
              pathname: '/analisis-academico',
              query: currentPage ? getPageQuery(currentPage - 1) : '',
            }}
            isDisabled={currentPage === 1 || !totalSize}
            className="mr-1 h-6 px-2 py-0 text-xs sm:h-9 lg:mr-2 lg:px-3.5 xl:text-sm"
          />
          {pagesButtons.map((buttonNumber, index) => {
            if (buttonNumber === null)
              return (
                <Skeleton
                  key={index}
                  className="h-6 w-6 rounded-md bg-muted-foreground/15 sm:h-9 sm:w-9"
                />
              )
            return buttonNumber !== '...' ? (
              <PaginationLink
                key={index}
                href={{
                  pathname: '/analisis-academico',
                  query: getPageQuery(buttonNumber),
                }}
                isActive={buttonNumber === currentPage}
                className="h-6 w-6 text-xs sm:h-9 sm:w-9 xl:text-sm"
              >
                {buttonNumber}
              </PaginationLink>
            ) : (
              <PaginationEllipsis
                key={index}
                className="h-6 w-6 sm:h-9 sm:w-9"
              />
            )
          })}
          <PaginationNext
            href={{
              pathname: '/analisis-academico',
              query: currentPage ? getPageQuery(currentPage + 1) : '',
            }}
            isDisabled={currentPage === lastPage || !totalSize}
            className="ml-1 h-6 px-2 py-0 text-xs sm:h-9 lg:mr-2 lg:px-3.5 xl:text-sm"
          />
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default TablePagination
