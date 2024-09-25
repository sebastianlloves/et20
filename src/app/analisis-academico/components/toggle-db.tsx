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
    params.set('anio', value)
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Tabs defaultValue={prevValue} onValueChange={handleChange} className="hidden lg:block">
      <TabsList className="w-full h-fit rounded-lg shadow-sm p-1">
        <TabsTrigger
          value={'2023'}
          className="w-full text-base rounded-md data-[state=active]:bg-card"
        >
          2023
        </TabsTrigger>
        <TabsTrigger
          value={'2024'}
          className="w-full text-base rounded-md data-[state=active]:bg-card"
        >
          2024
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export default ToggleDB
