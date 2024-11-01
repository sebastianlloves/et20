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

const getPagesNumbers = (currentPage: number, lastPage: number) => {
  if (lastPage <= 7) return Array.from({ length: lastPage }, (_, i) => i + 1)
  if (currentPage <= 5)
    return [...Array.from({ length: 5 }, (_, i) => i + 1), lastPage]
  if (lastPage - currentPage <= 5)
    return [1, ...Array.from({ length: 5 }, (_, i) => lastPage - i), lastPage]
}

/* 
export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
*/
