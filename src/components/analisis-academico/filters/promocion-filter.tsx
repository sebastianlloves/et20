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
  const promocionTags = promocionValue
    ? [
        {
          value: promocionValueTag[promocionValue],
          quantity:
            uniqueValues &&
            (uniqueValues.get(promocionValueTag[promocionValue]) ?? 0),
        },
      ]
    : []

  const updateParams = (newPromocionValue: string) => {
    promocionValue === newPromocionValue
      ? searchParams.delete('promocion')
      : searchParams.set('promocion', newPromocionValue)
    if (searchParams.has('page')) searchParams.delete('page')
    replace(`${pathname}?${searchParams}`)
  }

  const handleRemoveAll = () => {
    searchParams.delete('promocion')
    if (searchParams.has('page')) searchParams.delete('page')
    replace(`${pathname}?${searchParams}`)
  }

  return (
    <Filter
      title="Promoción"
      maxTags={2}
      icon={<BadgeCheck strokeWidth={1.0} className="w-[16px] lg:w-[18px]" />}
      filterTags={promocionTags}
      handleRemoveTag={handleRemoveAll}
      handleRemoveAll={handleRemoveAll}
    >
      <DropdownMenuRadioGroup
        value={promocionValue || undefined}
        onValueChange={(value) => updateParams(value)}
      >
        <DropdownMenuRadioItem
          value="solo promocionan"
          disabled={
            !uniqueValues ||
            !uniqueValues.get(promocionValueTag['solo promocionan'])
          }
          onSelect={(e) => e.preventDefault()}
          className="cursor-pointer"
        >
          <MenuItem
            value={promocionValueTag['solo promocionan']}
            quantity={
              uniqueValues &&
              (uniqueValues.get(promocionValueTag['solo promocionan']) ?? 0)
            }
          />
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem
          value="solo permanecen"
          disabled={
            !uniqueValues ||
            !uniqueValues.get(promocionValueTag['solo permanecen'])
          }
          onSelect={(e) => e.preventDefault()}
          className="cursor-pointer"
        >
          <MenuItem
            value={promocionValueTag['solo permanecen']}
            quantity={
              uniqueValues &&
              (uniqueValues.get(promocionValueTag['solo permanecen']) ?? 0)
            }
          />
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </Filter>
  )
}

export default PromocionFilter
