'use client'

import { cn } from '@/lib/utils'

export default function MenuItem({
  value,
  quantity,
}: {
  value: string
  quantity?: number
}) {
  return (
    <div className="flex w-full items-end justify-between gap-x-7">
      <h4 className="align-middle text-sm">{value}</h4>
      <p
        className={cn(
          'w-5 text-right align-middle font-mono leading-tight text-muted-foreground/90',
          quantity === 0 && 'text-muted-foreground/60',
        )}
      >
        {quantity}
      </p>
    </div>
  )
}
