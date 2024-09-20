'use client'

import { Calculator } from 'lucide-react'
import SliderItem from './slider-item'
import useParamsState from '@/hooks/useParamsState'
import Filter from './filter'
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

function CantidadesFilter({
  cantidadesUniqueValues,
  cantidadesMinMaxValues,
}: {
  cantidadesUniqueValues?: Map<string, number>
  cantidadesMinMaxValues?: {
    troncalesMinMax: number[]
    generalesMinMax: number[]
    enProceso2020MinMax: number[]
  }
}) {
  const { pathname, searchParams, replace } = useParamsState()
  const { filterValue: troncalesValue, filterTag: troncalesTag } =
    getCantidadesData(
      searchParams.get('cantidadesTroncales'),
      cantidadesUniqueValues &&
        Array.from(cantidadesUniqueValues.entries()).filter(
          ([key]) => key.split('_')[0] === 'troncales',
        ),
      {
        plural: 'troncales',
        singular: 'troncal',
      },
    )
  const { filterValue: generalesValue, filterTag: generalesTag } =
    getCantidadesData(
      searchParams.get('cantidadesGenerales'),
      cantidadesUniqueValues &&
        Array.from(cantidadesUniqueValues.entries()).filter(
          ([key]) => key.split('_')[0] === 'generales',
        ),
      {
        plural: 'generales',
        singular: 'general',
      },
    )
  const showEnProceso2020 = searchParams.get('enProceso2020') !== 'false'
  const { filterValue: enProceso2020Value, filterTag: enProceso2020Tag } =
    getCantidadesData(
      searchParams.get('cantidadesEnProceso2020'),
      cantidadesUniqueValues &&
        Array.from(cantidadesUniqueValues.entries()).filter(
          ([key]) => key.split('_')[0] === 'enProceso2020',
        ),
      {
        plural: 'en Proceso (2020)',
        singular: 'en Proceso (2020)',
      },
    )

  const filterTags = [
    troncalesTag,
    generalesTag,
    showEnProceso2020 ? enProceso2020Tag : undefined,
  ].filter((value) => value !== undefined)

  const updateParams =
    (paramKey: string) => (value: number[], min: number, max: number) => {
      value[0] === min && value[1] === max
        ? searchParams.delete(paramKey)
        : searchParams.set(paramKey, value.join('_'))
      replace(`${pathname}?${searchParams}`)
    }

  const handleRemoveAll = () => {
    searchParams.delete('cantidadesTroncales')
    searchParams.delete('cantidadesGenerales')
    searchParams.delete('cantidadesEnProceso2020')
    replace(`${pathname}?${searchParams}`)
  }

  const handleRemoveTag = (value: string) => {
    if (value.split(' ').at(-1)?.includes('troncal'))
      searchParams.delete('cantidadesTroncales')
    if (value.split(' ').at(-1)?.includes('general'))
      searchParams.delete('cantidadesGenerales')
    if (value.split(' ').at(-1)?.includes('2020'))
      searchParams.delete('cantidadesEnProceso2020')
    replace(`${pathname}?${searchParams}`)
  }

  return (
    <Filter
      title="Cantidades"
      maxTags={3}
      filterTags={filterTags}
      icon={<Calculator size={17} strokeWidth={1.2} />}
      handleRemoveAll={handleRemoveAll}
      handleRemoveTag={handleRemoveTag}
    >
      <DropdownMenuItem
        onSelect={(e) => e.preventDefault()}
        disabled={
          cantidadesMinMaxValues?.troncalesMinMax[0] ===
          cantidadesMinMaxValues?.troncalesMinMax[1]
        }
      >
        <SliderItem
          title="Troncales"
          updateParams={updateParams('cantidadesTroncales')}
          filterValue={troncalesValue}
          min={cantidadesMinMaxValues?.troncalesMinMax[0] || 0}
          max={cantidadesMinMaxValues?.troncalesMinMax[1] || 0}
        />
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onSelect={(e) => e.preventDefault()}
        disabled={
          cantidadesMinMaxValues?.generalesMinMax[0] ===
          cantidadesMinMaxValues?.generalesMinMax[1]
        }
      >
        <SliderItem
          title="Generales"
          updateParams={updateParams('cantidadesGenerales')}
          filterValue={generalesValue}
          min={cantidadesMinMaxValues?.generalesMinMax[0] || 0}
          max={cantidadesMinMaxValues?.generalesMinMax[1] || 0}
        />
      </DropdownMenuItem>
      {showEnProceso2020 && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            disabled={
              cantidadesMinMaxValues?.enProceso2020MinMax[0] ===
              cantidadesMinMaxValues?.enProceso2020MinMax[1]
            }
          >
            <SliderItem
              title="En Proceso (2020)"
              updateParams={updateParams('cantidadesEnProceso2020')}
              filterValue={enProceso2020Value}
              min={cantidadesMinMaxValues?.enProceso2020MinMax[0] || 0}
              max={cantidadesMinMaxValues?.enProceso2020MinMax[1] || 0}
            />
          </DropdownMenuItem>
        </>
      )}
    </Filter>
  )
}
export default CantidadesFilter

function getCantidadesData(
  paramValue: string | null,
  uniqueValues: Array<[string, number]> | undefined,
  materiaType: {
    singular: string
    plural: string
  },
) {
  const filterValue = paramValue
    ?.split('_')
    .map((value) => Number(value))
    .sort((a, b) => a - b)

  const formatedUniqueValues = uniqueValues?.map(([key, value]) => [
    Number(key.split('_')[1]),
    value,
  ])
  const quantity = formatedUniqueValues?.reduce(
    (acc, [key, value]) =>
      filterValue && key >= filterValue[0] && key <= filterValue[1]
        ? acc + value
        : acc,
    0,
  )
  return {
    filterValue,
    filterTag: filterValue && {
      value: getCantidadesFilterValue(filterValue, materiaType),
      quantity,
    },
  }
}

function getCantidadesFilterValue(
  [min, max]: number[],
  materiaType: { singular: string; plural: string },
) {
  if (min === 0) {
    if (max === 0) return `No adeuda materias ${materiaType.plural}`
    return `Hasta ${max} materia${max > 1 ? 's' : ''} ${max > 1 ? materiaType.plural : materiaType.singular}`
  }
  if (min === max)
    return `${max} materia${max > 1 ? 's' : ''} ${max > 1 ? materiaType.plural : materiaType.singular}`
  return `Entre ${min} y ${max} materia${max > 1 ? 's' : ''} ${max > 1 ? materiaType.plural : materiaType.singular}`
}
