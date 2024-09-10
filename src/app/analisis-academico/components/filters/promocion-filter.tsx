'use client'

import useParamsState from '@/hooks/useParamsState'
import Filter from './filter'
import { BadgeCheck } from 'lucide-react'
import MenuItem from './menu-item'
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'

const filterValueTag: { [key: string]: string } = {
  'solo promocionan': 'Estudiantes que promocionan',
  'solo permanecen': 'Estudiantes que permanecen',
}

function PromocionFilter({
  uniqueValues,
}: {
  uniqueValues: Map<string, number>
}) {
  const { pathname, searchParams, replace } = useParamsState()
  const filterValue = searchParams.get('promocion') || undefined

  const updateParams = (promocionValue: string) => {
    filterValue === promocionValue
      ? searchParams.delete('promocion')
      : searchParams.set('promocion', promocionValue)
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
      filterTags={filterValue ? [filterValueTag[filterValue]] : []}
      uniqueValues={uniqueValues}
      handleRemoveTag={handleRemoveTag}
      handleRemoveAll={handleRemoveAll}
    >
      <DropdownMenuRadioGroup
        value={filterValue}
        onValueChange={(value) => updateParams(value)}
      >
        <DropdownMenuRadioItem
          value="solo promocionan"
          onSelect={(e) => e.preventDefault()}
          className="cursor-pointer"
        >
          <MenuItem
            value={filterValueTag['solo promocionan']}
            quantity={uniqueValues.get(filterValueTag['solo promocionan']) ?? 0}
          />
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem
          value="solo permanecen"
          onSelect={(e) => e.preventDefault()}
          className="cursor-pointer"
        >
          <MenuItem
            value={filterValueTag['solo permanecen']}
            quantity={uniqueValues.get(filterValueTag['solo permanecen']) ?? 0}
          />
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </Filter>
  )
}

export default PromocionFilter
