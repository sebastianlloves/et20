'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Slider } from '@/components/ui/slider'
import useParamsState from '@/hooks/useParamsState'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

function SliderItem({ title, paramKey }: { title: string; paramKey: string }) {
  const { pathname, searchParams, replace } = useParamsState()
  const filterValue = searchParams
    .get(paramKey)
    ?.split('_')
    .map((value) => Number(value)) || [0, 4]

  const [rangeValue, setRangeValue] = useState(filterValue)

  const handleChange = useDebouncedCallback((value) => {
    value[0] === 0 && value[1] === 4
      ? searchParams.delete(paramKey)
      : searchParams.set(paramKey, value.join('_'))
    replace(`${pathname}?${searchParams}`)
  }, 700)

  return (
    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
      <div className='flex gap-2'>
        <h4 className="text-left text-sm font-normal">{title}</h4>
        <div className="flex items-center gap-x-1 border">
          <span className="w-8 text-center text-sm font-light">
            {rangeValue[0]}
          </span>
          <Slider
            defaultValue={filterValue}
            max={4}
            step={1}
            className="w-40"
            onValueChange={(value) => {
              setRangeValue(value)
              handleChange(value)
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
