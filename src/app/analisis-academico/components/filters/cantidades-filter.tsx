'use client'

import { Calculator } from 'lucide-react'
import SliderItem from './slider-item'
import useParamsState from '@/hooks/useParamsState'
import Filter from './filter'

function CantidadesFilter({
  maxMinValues,
  uniqueValues,
}: {
  maxMinValues?: number[]
  uniqueValues?: Map<number, number>
}) {
  const { pathname, searchParams, replace } = useParamsState()
  const troncalesValue =
    searchParams
      .get('cantTroncales')
      ?.split('_')
      .map((value) => Number(value))

  const troncalesTag = troncalesValue && {
    value:
      troncalesValue[0] === troncalesValue[1]
        ? `${troncalesValue[0]} materias troncales`
        : troncalesValue[0] === 0
          ? `Hasta ${troncalesValue[1]} materias troncales`
          : `Entre ${troncalesValue[0]} y ${troncalesValue[1]} materias troncales`,
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
      filterTags={troncalesTag && [troncalesTag]}
      icon={<Calculator size={17} strokeWidth={1.2} />}
      handleRemoveAll={handleRemoveAll}
      handleRemoveTag={handleRemoveTag}
    >
      <SliderItem title="Troncales" paramKey="cantTroncales" />
    </Filter>
  )
}
export default CantidadesFilter
