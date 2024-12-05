import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button, ButtonProps, buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
)
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
))
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
))
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
  isDisabled?: boolean
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<typeof Link>

const PaginationLink = ({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) => (
  <PaginationItem>
    <Link
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? 'outline' : 'ghost',
          size,
        }),
        className,
      )}
      {...props}
    />
  </PaginationItem>
)
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({
  className,
  isDisabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) =>
  isDisabled ? (
    <Button
      disabled
      variant="ghost"
      className={cn('gap-1.5 pl-2.5', className)}
    >
      <ChevronLeft className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
      <span>Anterior</span>
    </Button>
  ) : (
    <PaginationLink
      aria-label="Ir a la página anterior"
      size="default"
      className={cn('gap-1.5 pl-2.5', className)}
      {...props}
    >
      <ChevronLeft className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
      <span>Anterior</span>
    </PaginationLink>
  )
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({
  className,
  isDisabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) =>
  isDisabled ? (
    <Button
      disabled
      variant="ghost"
      className={cn('gap-1.5 pr-2.5', className)}
    >
      <span>Siguiente</span>
      <ChevronRight className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
    </Button>
  ) : (
    <PaginationLink
      aria-label="Ir a la siguiente página"
      size="default"
      className={cn('gap-1.5 pr-2.5', className)}
      {...props}
    >
      <span>Siguiente</span>
      <ChevronRight className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
    </PaginationLink>
  )
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn(
      buttonVariants({
        variant: 'ghost',
        size: 'icon',
      }),
      'flex items-end justify-center p-0 hover:bg-[inherit]',
      className,
    )}
    {...props}
  >
    <MoreHorizontal strokeWidth={1} className="mb-1 h-4 w-4 lg:mb-1.5" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
