'use client'

import useParamsState from '@/hooks/useParamsState'
import Filter from './filter'
import { BadgeCheck } from 'lucide-react'
import MenuItem from './menu-item'
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'

const promocionValueTag: { [key: string]: string } = {
  'solo promocionan': 'Estudiantes que promocionan',
  'solo permanecen': 'Estudiantes que permanecen',
}

function PromocionFilter({
  uniqueValues,
}: {
  uniqueValues?: Map<string, number>
}) {
  const { pathname, searchParams, replace } = useParamsState()
  const promocionValue = searchParams.get('promocion')
  const promocionTag = promocionValue
    ? [
        {
          value: promocionValue,
          quantity: uniqueValues && (uniqueValues.get(promocionValue) ?? 0),
        },
      ]
    : []

  const updateParams = (newPromocionValue: string) => {
    promocionValue === newPromocionValue
      ? searchParams.delete('promocion')
      : searchParams.set('promocion', newPromocionValue)
    replace(`${pathname}?${searchParams.toString()}`)
  }

  const handleRemoveAll = () => {
    searchParams.delete('promocion')
    replace(`${pathname}?${searchParams}`)
  }

  const handleRemoveTag = handleRemoveAll

  return (
    <Filter
      title="Promoción"
      maxTags={4}
      icon={<BadgeCheck size={18} strokeWidth={1.0} />}
      filterTags={promocionTag}
      handleRemoveTag={handleRemoveTag}
      handleRemoveAll={handleRemoveAll}
    >
      <DropdownMenuRadioGroup
        value={promocionValue || undefined}
        onValueChange={(value) => updateParams(value)}
      >
        <DropdownMenuRadioItem
          value="solo promocionan"
          onSelect={(e) => e.preventDefault()}
          className="cursor-pointer"
        >
          <MenuItem
            value={promocionValueTag['solo promocionan']}
            quantity={
              uniqueValues?.get(promocionValueTag['solo promocionan']) ?? 0
            }
          />
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem
          value="solo permanecen"
          onSelect={(e) => e.preventDefault()}
          className="cursor-pointer"
        >
          <MenuItem
            value={promocionValueTag['solo permanecen']}
            quantity={
              uniqueValues?.get(promocionValueTag['solo permanecen']) ?? 0
            }
          />
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </Filter>
  )
}

export default PromocionFilter
