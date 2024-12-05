'use client'

import { Button } from '@/components/ui/button'
import { PaginationItem } from '@/components/ui/pagination'
import { useStateInUrl } from '@/hooks/useParamsState'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

function PaginationButton({
  newState,
  className,
  isActive,
  isDisabled,
  children,
}: {
  newState: string
  className?: string
  isActive?: boolean
  isDisabled?: boolean
  children?: string | ReactNode
}) {
  const { updateSearchParams } = useStateInUrl()
  return (
    <PaginationItem>
      <Button
        variant={isActive ? 'outline' : 'ghost'}
        className={cn('h-6 w-6 text-xs sm:h-9 sm:w-9 xl:text-sm', className)}
        onClick={() => updateSearchParams([{ keyParam: 'page', newState }])}
      >
        {children}
      </Button>
    </PaginationItem>
  )
}

export default PaginationButton
