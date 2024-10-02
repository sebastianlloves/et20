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
import useParamsState from '@/hooks/useParamsState'
import { getCantRepitenciasString, getSliderFilterData } from '../../utils'

function RepitenciaFilter({
  repitenciaAniosUniqueValues,
  repitenciaCantUniqueValues,
  repitenciaCantMinMaxValues,
}: {
  repitenciaAniosUniqueValues?: Map<string, number>
  repitenciaCantUniqueValues?: Map<string, number>
  repitenciaCantMinMaxValues?: number[]
}) {
  const { pathname, searchParams, replace } = useParamsState()
  const anios = Object.keys(CURSOS)
    .sort(
      (a, b) =>
        Number(a.split(' ')[0].slice(0, -1)) -
        Number(b.split(' ')[0].slice(0, -1)),
    )
    .slice(0, -1)
  const repitenciaAniosValue =
    searchParams
      .get('repitenciaAnios')
      ?.split('_')
      .sort(
        (a, b) =>
          Number(a.split(' ')[0].slice(0, -1)) -
          Number(b.split(' ')[0].slice(0, -1)),
      ) || []
  const repitenciaAniosTags = repitenciaAniosValue.map((value) => {
    const quantity =
      repitenciaAniosUniqueValues &&
      (repitenciaAniosUniqueValues.get(value) ?? 0)
    return { value: `Repitió ${value}`, quantity }
  })

  const { filterValue: repitenciaCantValue, filterTag: repitenciaCantTag } =
    getSliderFilterData(
      searchParams.get('repitenciaCant'),
      getCantRepitenciasString,
      repitenciaCantUniqueValues &&
        Array.from(repitenciaCantUniqueValues.entries()).filter(
          ([key]) => key.split('_')[0] === 'cant',
        ),
    )

  const repitenciaTags = [...repitenciaAniosTags, repitenciaCantTag].filter(
    (value) => value !== undefined,
  )

  const updateAniosParam = (anio: string) => {
    const newRepitenciaState = repitenciaAniosValue.includes(anio)
      ? repitenciaAniosValue.filter((prevAnio) => prevAnio !== anio)
      : [...repitenciaAniosValue, anio]
    newRepitenciaState.length
      ? searchParams.set('repitenciaAnios', newRepitenciaState.join('_'))
      : searchParams.delete('repitenciaAnios')
    replace(`${pathname}?${searchParams}`)
  }

  const updateCantParam = (value: number[], min: number, max: number) => {
    value[0] === min && value[1] === max
      ? searchParams.delete('repitenciaCant')
      : searchParams.set('repitenciaCant', value.join('_'))
    replace(`${pathname}?${searchParams}`)
  }

  const handleRemoveTag = (tagValue: string) => {
    if (tagValue.includes('año')) {
      const value = tagValue.split('Repite ')[1]
      const newState = repitenciaAniosValue.filter(
        (prevValue) => prevValue !== value,
      )
      newState.length
        ? searchParams.set('repitenciaAnios', newState.join('_'))
        : searchParams.delete('repitenciaAnios')
    } else {
      searchParams.delete('repitenciaCant')
    }
    replace(`${pathname}?${searchParams}`)
  }

  const handleRemoveAll = () => {
    searchParams.delete('repitenciaAnios')
    searchParams.delete('repitenciaCant')
    replace(`${pathname}?${searchParams}`)
  }

  return (
    <Filter
      title="Repitencia"
      maxTags={3}
      icon={<IterationCcw size={15} strokeWidth={1.4} />}
      filterTags={repitenciaTags}
      handleRemoveTag={handleRemoveTag}
      handleRemoveAll={handleRemoveAll}
    >
      <>
        {anios.map((anio) => (
          <DropdownMenuCheckboxItem
            key={anio}
            onSelect={(e) => e.preventDefault()}
            checked={repitenciaAniosValue.includes(anio)}
            onCheckedChange={() => updateAniosParam(anio)}
            disabled={
              !repitenciaAniosUniqueValues ||
              !repitenciaAniosUniqueValues.get(anio)
            }
            className="w-[150px] cursor-pointer sm:w-full"
          >
            <MenuItem
              value={`Repitió ${anio}`}
              quantity={
                repitenciaAniosUniqueValues &&
                (repitenciaAniosUniqueValues.get(anio) ?? 0)
              }
            />
          </DropdownMenuCheckboxItem>
        ))}
      </>
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={(e) => e.preventDefault()} disabled={false}>
        <SliderItem
          title="Cantidad"
          updateParams={updateCantParam}
          filterValue={repitenciaCantValue}
          min={repitenciaCantMinMaxValues?.[0] || 0}
          max={repitenciaCantMinMaxValues?.[1] || 0}
        />
      </DropdownMenuItem>
    </Filter>
  )
}

export default RepitenciaFilter
