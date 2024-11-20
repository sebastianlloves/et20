'use client'

import { SearchParams } from '@/app/analisis-academico/page'
import useParamsState from '@/hooks/useParamsState'
import { ReactNode } from 'react'

export default function MenuItem({
  value,
  quantity,
  newQueryState,
  paramKeys,
  children,
}: {
  value?: string
  newQueryState: SearchParams
  paramKeys: (keyof SearchParams)[]
  quantity?: number
  children?: ReactNode
}) {
  const { updateParams } = useParamsState()

  return (
    <div
      className="flex w-full items-center justify-between gap-x-4 py-1.5 pl-6 pr-2 sm:gap-x-7 lg:pl-8"
      onClick={() => updateParams(newQueryState, paramKeys)}
    >
      {children || (
        <>
          <h4 className="align-middle">{value}</h4>
          {quantity !== undefined && (
            <p className="w-5.5 text-right align-middle font-mono leading-tight text-muted-foreground/90">
              {' '}
              {quantity}{' '}
            </p>
          )}
        </>
      )}
    </div>
  )
}
