import 'server-only'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import PaginationButton from './pagination-button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function TablePagination({
  paginationUtils,
}: {
  paginationUtils: {
    currentPage: number | null
    lastPage: number | null
    indexFirstElement: number | null
    indexLastElement: number | null
    totalSize: number | null
    pagesButtons: (string | number | null)[]
  }
}) {
  const {
    currentPage,
    lastPage,
    indexFirstElement,
    indexLastElement,
    totalSize,
    pagesButtons,
  } = paginationUtils

  return (
    <div className="my-0 flex flex-col items-center justify-between gap-y-2.5 md:flex-row lg:col-start-2 xl:px-4">
      <div className="flex h-7 w-fit shrink-0 items-center self-start align-middle sm:h-10">
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
          <PaginationButton
            className="mr-1 h-7 px-2 py-0 text-xs sm:h-9 lg:mr-2 lg:px-3.5 xl:text-sm"
            isDisabled={currentPage === 1 || !totalSize}
            newState={
              currentPage ? [currentPage - 1, lastPage].join('_') : undefined
            }
          >
            <div className="flex items-center justify-center gap-1.5">
              <ChevronLeft className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              <span>Anterior</span>
            </div>
          </PaginationButton>
          {pagesButtons.map((buttonNumber, index) => {
            if (buttonNumber === null)
              return (
                <Skeleton
                  key={index}
                  className="h-7 w-7 rounded-md bg-muted-foreground/15 sm:h-9 sm:w-10"
                />
              )
            return buttonNumber !== '...' ? (
              <PaginationButton
                key={index}
                className="h-7 w-7 text-xs sm:h-9 sm:w-10 xl:text-sm"
                isActive={buttonNumber === currentPage}
                newState={[buttonNumber, lastPage].join('_')}
              >
                {buttonNumber}
              </PaginationButton>
            ) : (
              <PaginationEllipsis
                key={index}
                className="h-7 w-7 sm:h-9 sm:w-10"
              />
            )
          })}
          <PaginationButton
            className="ml-1 h-7 px-2 py-0 text-xs sm:h-9 lg:mr-2 lg:px-3.5 xl:text-sm"
            isDisabled={currentPage === lastPage || !totalSize}
            newState={[currentPage ? currentPage + 1 : 2, lastPage].join('_')}
          >
            <div className="flex items-center justify-center gap-1.5">
              <span>Siguiente</span>
              <ChevronRight className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
            </div>
          </PaginationButton>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export default TablePagination
