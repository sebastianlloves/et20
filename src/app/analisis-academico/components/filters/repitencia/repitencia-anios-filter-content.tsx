'use client'

import { ItemData } from '@/app/analisis-academico/utils/definitions'
import { DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu'
import MenuItem from '../menu-item'
import { updateArrFilterState } from '@/app/analisis-academico/utils/urlParamsOperations'
import { useStateInUrl } from '@/hooks/useParamsState'

function RepitenciaAniosFilterContent({
  filterValue,
  filterItemsData,
}: {
  filterValue?: string[]
  filterItemsData: ItemData[]
}) {
  const { updateSearchParams } = useStateInUrl()

  return (
    <>
      {filterItemsData.map(
        ({ value, itemText, quantity, isSelected, isDisabled }) => (
          <DropdownMenuCheckboxItem
            key={itemText}
            className="cursor-pointer sm:w-full"
            checked={isSelected}
            disabled={isDisabled}
            onCheckedChange={() => {
              const newFilterState = updateArrFilterState(value, filterValue)
              updateSearchParams([
                { keyParam: 'repitenciaAnios', newState: newFilterState },
              ])
            }}
          >
            <MenuItem value={itemText} quantity={quantity} />
          </DropdownMenuCheckboxItem>
        ),
      )}
    </>
  )
}

export default RepitenciaAniosFilterContent
