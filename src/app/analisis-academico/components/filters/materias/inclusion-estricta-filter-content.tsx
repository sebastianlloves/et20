'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import MenuItem from '../menu-item'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ItemData } from '@/app/analisis-academico/utils/definitions'
import { useStateInUrl } from '@/hooks/useParamsState'

function InclusionEstrictaFilterContent({
  itemData,
}: {
  itemData: ItemData
}) {
  const { value, itemText, isSelected, isDisabled } = itemData
  const { updateSearchParams } = useStateInUrl()

  return (
    <DropdownMenuItem
      className="w-full"
      disabled={isDisabled}
      onSelect={() => {
        const newState = isSelected ? undefined : value
        updateSearchParams([{ keyParam: 'inclusionEstricta', newState }])
      }}
    >
      <MenuItem>
        <div className="flex w-full items-center justify-between gap-4 lg:gap-6">
          <Label
            htmlFor="estrict-inclusion"
            className="cursor-pointer text-[length:inherit] font-normal text-foreground"
          >
            {itemText}
          </Label>
          <Switch
            id="estrict-inclusion"
            className="h-4 w-8"
            checked={isSelected}
          />
        </div>
      </MenuItem>
    </DropdownMenuItem>
  )
}

export default InclusionEstrictaFilterContent
