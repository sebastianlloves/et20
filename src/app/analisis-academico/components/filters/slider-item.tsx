'use client'

import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

function SliderItem({
  title,
  updateParams,
  filterValue,
  min,
  max,
  className,
}: {
  title: string
  updateParams: (value: number[], min: number, max: number) => void
  filterValue?: number[]
  min: number
  max: number
  className?: string
}) {
  const [rangeValue, setRangeValue] = useState(filterValue || [min, max])
  const debounceUpdateParams = useDebouncedCallback(updateParams, 600)

  return (
    <div className="my-0.5 flex w-full flex-col gap-1.5">
      <h4 className="text-left text-[length:inherit] font-medium text-foreground/80">
        {title}
      </h4>
      <div className="flex items-center gap-x-1 px-0.5">
        <span className="w-4 text-center text-[length:inherit] font-light">
          {rangeValue[0]}
        </span>
        <Slider
          defaultValue={filterValue || [min, max]}
          min={min}
          max={max}
          step={1}
          className={cn('min-w-20 max-w-40 sm:w-40', className)}
          onValueChange={(value) => {
            setRangeValue(value)
            debounceUpdateParams(value, min, max)
          }}
        />
        <span className="w-4 text-right text-[length:inherit] font-light">
          {rangeValue[1]}
        </span>
      </div>
    </div>
  )
}

export default SliderItem
