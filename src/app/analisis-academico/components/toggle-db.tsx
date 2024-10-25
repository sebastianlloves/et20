'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

function ToggleDB() {
  const searchParams = useSearchParams()
  const prevValue = searchParams.get('anio') || '2024'
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    // Borrar esta línea al acomodar la db de califActuales del 2023
    if (value === '2023') params.delete('proyeccion')
      
    params.set('anio', value)
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Tabs defaultValue={prevValue} onValueChange={handleChange}>
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
