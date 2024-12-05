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
  newState?: string
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
        className={cn('p-0', className)}
        disabled={isDisabled}
        onClick={() =>
          updateSearchParams([{ keyParam: 'page', newState }], false)
        }
      >
        {children}
      </Button>
    </PaginationItem>
  )
}

export default PaginationButton
