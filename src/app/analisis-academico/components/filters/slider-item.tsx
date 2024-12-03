'use client'

import { useStateInUrl } from '@/hooks/useParamsState'
import { useState } from 'react'
import { SearchParams } from '../../utils/definitions'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { useDebouncedCallback } from 'use-debounce'

function SliderItem({
  title,
  minMaxValues,
  filterValue,
  keyParam,
  className,
}: {
  title: string
  minMaxValues: {
    min: number
    max: number
  }
  filterValue?: {
    min: number
    max: number
  }
  keyParam: keyof SearchParams
  className?: string
}) {
  const { updateSearchParams } = useStateInUrl()
  const [rangeValue, setRangeValue] = useState(filterValue || minMaxValues)
  const debounceUpdateParams = useDebouncedCallback(updateSearchParams, 600)

  return (
    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
      <div className="my-0.5 flex w-full flex-col gap-1.5 px-2 py-1.5">
        <h4 className="text-left text-[length:inherit] font-medium text-foreground/80">
          {title}
        </h4>
        <div className="flex items-center gap-x-1 px-0.5">
          <span className="w-4 text-center text-[length:inherit] font-light">
            {rangeValue.min}
          </span>
          <Slider
            defaultValue={[rangeValue.min, rangeValue.max]}
            min={minMaxValues.min}
            max={minMaxValues.max}
            step={1}
            className={cn('min-w-20 max-w-40 sm:w-40', className)}
            onValueChange={(rangeValue) => {
              setRangeValue({ min: rangeValue[0], max: rangeValue[1] })
            }}
            onValueCommit={() => {
              const newState =
                rangeValue.min === minMaxValues.min &&
                rangeValue.max === minMaxValues.max
                  ? undefined
                  : [rangeValue.min, rangeValue.max]
              console.log(newState)
              debounceUpdateParams([{ keyParam, newState }])
            }}
          />
          <span className="w-4 text-right text-[length:inherit] font-light">
            {rangeValue.max}
          </span>
        </div>
      </div>
    </DropdownMenuItem>
  )
}

export default SliderItem
