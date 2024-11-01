'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useParamsState from '@/hooks/useParamsState'
import { cn } from '@/lib/utils'

function ToggleDB({ className }: { className?: string }) {
  const { pathname, searchParams, replace } = useParamsState()
  const prevValue = searchParams.get('anio') || '2024'

  const handleChange = (value: string) => {
    // Borrar esta línea al acomodar la db de califActuales del 2023
    if (value === '2023') searchParams.delete('califParciales')

    searchParams.set('anio', value)
    if (searchParams.has('page')) searchParams.delete('page')
    replace(`${pathname}?${searchParams.toString()}`)
  }

  return (
    <Tabs
      defaultValue={prevValue}
      onValueChange={handleChange}
      className={cn('', className)}
    >
      <TabsList className="h-fit w-full rounded-lg p-1 shadow-sm">
        <TabsTrigger
          value={'2023'}
          className="w-full rounded-md text-sm data-[state=active]:bg-card lg:text-base"
        >
          2023
        </TabsTrigger>
        <TabsTrigger
          value={'2024'}
          className="w-full rounded-md text-sm data-[state=active]:bg-card lg:text-base"
        >
          2024
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export default ToggleDB
