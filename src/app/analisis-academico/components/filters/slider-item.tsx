'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Slider } from '@/components/ui/slider'
import useParamsState from '@/hooks/useParamsState'

function SliderItem() {
  const { pathname, searchParams, replace } = useParamsState()
  const filterValue = searchParams
    .get('cantTroncales')
    ?.split('_')
    .map((value) => Number(value)) || [0, 4]

  return (
    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
      <Slider
        defaultValue={filterValue}
        max={4}
        step={1}
        className="w-40"
        onValueChange={(value) => {
          value[0] === 0 && value[1] === 4
            ? searchParams.delete('cantTroncales')
            : searchParams.set('cantTroncales', value.join('_'))
          replace(`${pathname}?${searchParams}`)
        }}
      />
    </DropdownMenuItem>
  )
}

export default SliderItem
