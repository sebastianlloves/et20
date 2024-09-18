'use client'

import { Calculator } from 'lucide-react'
import SliderItem from './slider-item'
import useParamsState from '@/hooks/useParamsState'
import Filter from './filter'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

function CantidadesFilter({
  cantTroncalesUniqueValues,
  cantGeneralesUniqueValues,
}: {
  cantTroncalesUniqueValues?: Map<number, number>
  cantGeneralesUniqueValues?: Map<number, number>
}) {
  const { pathname, searchParams, replace } = useParamsState()
  const {
    filterValue: troncalesValue,
    min: minTroncales,
    max: maxTroncales,
    filterTag: troncalesTag,
  } = getCantidadesData(
    searchParams.get('cantTroncales'),
    cantTroncalesUniqueValues,
    {
      plural: 'troncales',
      singular: 'troncal',
    },
  )
  const {
    filterValue: generalesValue,
    min: minGenerales,
    max: maxGenerales,
    filterTag: generalesTag,
  } = getCantidadesData(
    searchParams.get('cantGenerales'),
    cantGeneralesUniqueValues,
    {
      plural: 'generales',
      singular: 'general',
    },
  )

  const filterTags = [troncalesTag, generalesTag].filter(
    (value) => value !== undefined,
  )

  const updateParams =
    (paramKey: string) => (value: number[], min: number, max: number) => {
      const minValue = min < value[0] ? min : value[0]
      const maxValue = max > value[1] ? max : value[1]
      value[0] === minValue && value[1] === maxValue
        ? searchParams.delete(paramKey)
        : searchParams.set(paramKey, value.join('_'))
      replace(`${pathname}?${searchParams}`)
    }

  const handleRemoveAll = () => {
    if (searchParams.get('cantTroncales')) searchParams.delete('cantTroncales')
    if (searchParams.get('cantGenerales')) searchParams.delete('cantGenerales')
    replace(`${pathname}?${searchParams}`)
  }

  const handleRemoveTag = (value: string) => {
    if (value.split(' ').at(-1)?.includes('troncal'))
      searchParams.delete('cantTroncales')
    if (value.split(' ').at(-1)?.includes('general'))
      searchParams.delete('cantGenerales')
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
        disabled={minTroncales === maxTroncales}
      >
        <SliderItem
          title="Troncales"
          updateParams={updateParams('cantTroncales')}
          filterValue={troncalesValue}
          min={minTroncales}
          max={maxTroncales}
        />
      </DropdownMenuItem>
      <DropdownMenuItem
        onSelect={(e) => e.preventDefault()}
        disabled={minGenerales === maxGenerales}
      >
        <SliderItem
          title="Generales"
          updateParams={updateParams('cantGenerales')}
          filterValue={generalesValue}
          min={minGenerales}
          max={maxGenerales}
        />
      </DropdownMenuItem>
    </Filter>
  )
}
export default CantidadesFilter

function getCantidadesData(
  paramValue: string | null,
  uniqueValues: Map<number, number> | undefined,
  materiaType: {
    singular: string
    plural: string
  },
) {
  const filterValue = paramValue
    ?.split('_')
    .map((value) => Number(value))
    .sort((a, b) => a - b)

  const uniqueValuesArr = uniqueValues ? Array.from(uniqueValues.keys()) : [0]
  const quantity =
    uniqueValues &&
    Array.from(uniqueValues.entries()).reduce(
      (acc, [key, value]) =>
        filterValue && key >= filterValue[0] && key <= filterValue[1]
          ? acc + value
          : acc,
      0,
    )
  return {
    filterValue,
    min: Math.min(...uniqueValuesArr),
    max: Math.max(...uniqueValuesArr),
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
