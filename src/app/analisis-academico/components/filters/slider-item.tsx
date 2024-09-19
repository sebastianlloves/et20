'use client'

import { Slider } from '@/components/ui/slider'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

function SliderItem({
  title,
  updateParams,
  filterValue,
  min,
  max,
}: {
  title: string
  updateParams: (value: number[], min: number, max: number) => void
  filterValue?: number[]
  min: number
  max: number
}) {
  const [rangeValue, setRangeValue] = useState(filterValue || [min, max])
  const debounceUpdateParams = useDebouncedCallback(updateParams, 600)

  return (
    <div className="flex gap-2">
      <h4 className="text-left text-sm font-normal w-20 text-pretty">{title}</h4>
      <div className="flex items-center gap-x-1">
        <span className="w-8 text-center text-sm font-light">
          {rangeValue[0]}
        </span>
        <Slider
          defaultValue={filterValue || [min, max]}
          min={min}
          max={max}
          step={1}
          className="w-40"
          onValueChange={(value) => {
            setRangeValue(value)
            debounceUpdateParams(value, min, max)
          }}
        />
        <span className="w-8 text-center text-sm font-light">
          {rangeValue[1]}
        </span>
      </div>
    </div>
  )
}

export default SliderItem
