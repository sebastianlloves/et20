'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

function SliderItem() {
  return (
    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>a</DropdownMenuItem>
  )
}

export default SliderItem
