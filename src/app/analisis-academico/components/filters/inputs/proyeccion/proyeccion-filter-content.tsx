'use client'

import {
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import MenuItem from '../menu-item'
import { updateArrFilterState } from '@/app/analisis-academico/utils/urlParamsOperations'
import { useStateInUrl } from '@/hooks/useParamsState'
import { ItemData } from '@/app/analisis-academico/utils/definitions'

function ProyeccionFilterContent({
  filterValue,
  filterItemsData,
}: {
  filterValue: string[]
  filterItemsData: ItemData[]
}) {
  const { updateSearchParams } = useStateInUrl()

  return (
    <>
      {filterItemsData.map(({ value, itemText, quantity, isSelected }) => (
        <div key={itemText}>
          {value === 'Faltan datos' && (
            <DropdownMenuSeparator className="mx-1 bg-muted-foreground/15" />
          )}
          <DropdownMenuCheckboxItem
            className="cursor-pointer sm:w-full"
            disabled={quantity === 0}
            checked={isSelected}
            onCheckedChange={() => {
              const newFilterState = updateArrFilterState(value, filterValue)
              updateSearchParams([
                { keyParam: 'proyeccion', newState: newFilterState },
              ])
            }}
          >
            <MenuItem value={itemText} quantity={quantity} />
          </DropdownMenuCheckboxItem>
        </div>
      ))}
    </>
  )
}

export default ProyeccionFilterContent
