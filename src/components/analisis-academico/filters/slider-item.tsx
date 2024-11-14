'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Slider } from '@/components/ui/slider'
import useParamsState from '@/hooks/useParamsState'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

function SliderItem({
  title,
  min,
  max,
  paramKey,
  filterValue,
  className,
}: {
  title: string
  min: number
  max: number
  paramKey: string
  filterValue?: number[]
  className?: string
}) {
  const [rangeValue, setRangeValue] = useState(filterValue || [min, max])
  const { pathname, searchParams, replace } = useParamsState()
  const updateParams = (
    paramKey: string,
    value: number[],
    min: number,
    max: number,
  ) => {
    value[0] === min && value[1] === max
      ? searchParams.delete(paramKey)
      : searchParams.set(paramKey, value.join('_'))
    if (searchParams.has('page')) searchParams.delete('page')
    replace(`${pathname}?${searchParams}`)
  }
  const debounceUpdateParams = useDebouncedCallback(updateParams, 600)

  return (
    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
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
              debounceUpdateParams(paramKey, value, min, max)
            }}
          />
          <span className="w-4 text-right text-[length:inherit] font-light">
            {rangeValue[1]}
          </span>
        </div>
      </div>
    </DropdownMenuItem>
  )
}

export default SliderItem
