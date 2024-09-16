'use client'

import { Calculator } from 'lucide-react'
import SliderItem from './slider-item'
import useParamsState from '@/hooks/useParamsState'
import Filter from './filter'

function CantidadesFilter({
  uniqueValues,
}: {
  uniqueValues?: Map<number, number>
}) {
  const { pathname, searchParams, replace } = useParamsState()
  const troncalesValue = searchParams
    .get('cantTroncales')
    ?.split('_')
    .map((value) => Number(value))
    .sort()
    
  const minValue =
    (uniqueValues && Math.min(...Array.from(uniqueValues.keys()))) || 0
  const maxValue =
    (uniqueValues && Math.max(...Array.from(uniqueValues.keys()))) || 0

  const troncalesTag = troncalesValue && {
    value: getCantidadesFilterValue(troncalesValue, {
      plural: 'troncales',
      singular: 'troncal',
    }),
    quantity:
      uniqueValues &&
      Array.from(uniqueValues.entries()).reduce(
        (acc, [key, value]) =>
          key >= troncalesValue[0] && key <= troncalesValue[1]
            ? acc + value
            : acc,
        0,
      ),
  }

  const updateParams = (value: number[], min: number, max: number) => {
    value[0] === min && value[1] === max
      ? searchParams.delete('cantTroncales')
      : searchParams.set('cantTroncales', value.join('_'))
    replace(`${pathname}?${searchParams}`)
  }

  const handleRemoveAll = () => {
    if (searchParams.get('cantTroncales')) searchParams.delete('cantTroncales')
    replace(`${pathname}?${searchParams}`)
  }

  const handleRemoveTag = (value: string) => {
    if (value.split(' ').at(-1) === 'troncales')
      searchParams.delete('cantTroncales')
    replace(`${pathname}?${searchParams}`)
  }

  if (
    troncalesValue &&
    (minValue > troncalesValue[0] || maxValue < troncalesValue[1])
  ) {
    const min = troncalesValue[0] < minValue ? minValue : troncalesValue[0]
    const max = troncalesValue[1] > maxValue ? maxValue : troncalesValue[1]
    updateParams([min, max], minValue, maxValue)
  }

  return (
    <Filter
      title="Cantidades"
      maxTags={3}
      filterTags={troncalesTag && [troncalesTag]}
      icon={<Calculator size={17} strokeWidth={1.2} />}
      handleRemoveAll={handleRemoveAll}
      handleRemoveTag={handleRemoveTag}
    >
      <SliderItem
        title="Troncales"
        updateParams={updateParams}
        filterValue={troncalesValue}
        min={minValue}
        max={maxValue}
      />
    </Filter>
  )
}
export default CantidadesFilter

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
