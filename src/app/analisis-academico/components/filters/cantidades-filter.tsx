'use client'

import { Calculator } from 'lucide-react'
import Filter from './filter'
import SliderItem from './slider-item'
import useParamsState from '@/hooks/useParamsState'

function CantidadesFilter({
  maxMinValues,
  uniqueValues,
}: {
  maxMinValues?: number[]
  uniqueValues?: Map<number, number>
}) {
  const { pathname, searchParams, replace } = useParamsState()
  const filterValue =
    searchParams
      .get('cantTroncales')
      ?.split('_')
      .map((value) => Number(value)) || undefined

  const filterTags = filterValue
    ? filterValue[0] === filterValue[1]
      ? [`${filterValue[0]} materias troncales`]
      : filterValue[0] === 0
        ? [`Hasta ${filterValue[1]} materias troncales`]
        : [`Entre ${filterValue[0]} y ${filterValue[1]} materias troncales`]
    : []

  const handleRemoveAll = () => {
    if (searchParams.get('cantTroncales')) searchParams.delete('cantTroncales')
    replace(`${pathname}?${searchParams}`)
  }

  const handleRemoveTag = (value: string) => {
    if (value.split(' ').at(-1) === 'troncales')
      searchParams.delete('cantTroncales')
    replace(`${pathname}?${searchParams}`)
  }

  return (
    <Filter
      title="Cantidades"
      maxTags={3}
      icon={<Calculator size={17} strokeWidth={1.2} />}
      filterTags={filterTags}
      uniqueValues={uniqueValues}
      handleRemoveAll={handleRemoveAll}
      handleRemoveTag={handleRemoveTag}
    >
      <SliderItem title="Troncales" paramKey="cantTroncales" />
    </Filter>
  )
}
export default CantidadesFilter
