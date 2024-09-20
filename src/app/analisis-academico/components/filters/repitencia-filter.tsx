'use client'

import { CURSOS } from '@/lib/constants'
import Filter from './filter'
import { IterationCcw } from 'lucide-react'
import {
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import MenuItem from './menu-item'
import SliderItem from './slider-item'
import { useSearchParams } from 'next/navigation'

function RepitenciaFilter() {
  const anios = Object.keys(CURSOS)
    .sort(
      (a, b) =>
        Number(a.split(' ')[0].slice(0, -1)) -
        Number(b.split(' ')[0].slice(0, -1)),
    )
    .slice(0, -1)
  const searchParams = new URLSearchParams(useSearchParams())
  const filterValue = searchParams.get('repitenciaAnios')?.split('_')
  const updateAniosParam = (anio: string) => {
    filterValue && searchParams.set('repitenciaAnios', filterValue?.join('_'))
  }

  return (
    <Filter
      title="Repitencia"
      maxTags={3}
      icon={<IterationCcw size={15} strokeWidth={1.4} />}
      filterTags={[]}
      handleRemoveTag={() => undefined}
      handleRemoveAll={() => undefined}
    >
      <>
        {anios.map((anio) => (
          <DropdownMenuCheckboxItem
            key={anio}
            onCheckedChange={() => updateAniosParam(anio)}
          >
            <MenuItem value={anio} quantity={4} />
          </DropdownMenuCheckboxItem>
        ))}
      </>
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={(e) => e.preventDefault()} disabled={false}>
        <SliderItem
          title="Cantidad"
          updateParams={() => undefined}
          filterValue={[]}
          min={0}
          max={10}
          className="w-24"
        />
      </DropdownMenuItem>
    </Filter>
  )
}

export default RepitenciaFilter
