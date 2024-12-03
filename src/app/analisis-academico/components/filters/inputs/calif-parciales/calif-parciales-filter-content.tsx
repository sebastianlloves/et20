'use client'

import { ItemData } from '@/app/analisis-academico/utils/definitions'
import {
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useStateInUrl } from '@/hooks/useParamsState'
import MenuItem from '../menu-item'

function CalifParcialesFilterContent({
  filterValue,
  filterItemsData,
}: {
  filterValue?: string
  filterItemsData: ItemData[]
}) {
  const { updateSearchParams } = useStateInUrl()
  const radioGroupValue = filterItemsData.find(
    ({ isSelected }) => isSelected,
  )?.value

  return (
    <DropdownMenuRadioGroup
      value={typeof radioGroupValue === 'string' ? radioGroupValue : undefined}
      onValueChange={(value) => {
        const newFilterState = value === filterValue ? undefined : value
        updateSearchParams([
          { keyParam: 'califParciales', newState: newFilterState },
        ])
      }}
    >
      <DropdownMenuLabel className="max-w-[var(--radix-dropdown-menu-trigger-width)] text-pretty pl-3">
        Incluir calificaciones del año en curso
      </DropdownMenuLabel>
      {filterItemsData.map(({ value, itemText, isDisabled }) => (
        <div key={itemText}>
          {(value === 'primerCuatrimestre' || value === 'acreditacion') && (
            <DropdownMenuSeparator className="mx-1 bg-muted-foreground/15" />
          )}
          <DropdownMenuRadioItem
            value={typeof value === 'string' ? value : value.toString()}
            className="cursor-pointer"
            disabled={isDisabled}
          >
            <MenuItem value={itemText} />
          </DropdownMenuRadioItem>
        </div>
      ))}
    </DropdownMenuRadioGroup>
  )
}

export default CalifParcialesFilterContent
