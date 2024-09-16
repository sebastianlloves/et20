'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
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
    <DropdownMenuItem
      disabled={min === 0 && max === 0}
      onSelect={(e) => e.preventDefault()}
    >
      <div className="flex gap-2">
        <h4 className="text-left text-sm font-normal">{title}</h4>
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
    </DropdownMenuItem>
  )
}

export default SliderItem
