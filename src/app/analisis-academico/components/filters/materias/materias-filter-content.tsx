'use client'

import { ItemData } from '@/app/analisis-academico/utils/definitions'
import {
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import MenuItem from '../menu-item'
import { updateArrFilterState } from '@/app/analisis-academico/utils/urlParamsOperations'
import { useStateInUrl } from '@/hooks/useParamsState'

function MateriasFilterContent({
  filterValue,
  aniosItemsData,
}: {
  aniosItemsData: {
    anio: '1° año' | '2° año' | '3° año' | '4° año' | '5° año' | '6° año'
    partialFilterValues?: string[]
    materiasAnioItems: ItemData[]
    orientaciones?: ItemData[]
    todasAnio: ItemData
  }[]
  filterValue?: string[]
}) {
  const { updateSearchParams } = useStateInUrl()

  return (
    <div className="text-xs lg:text-sm">
      {aniosItemsData.map(
        ({
          anio,
          partialFilterValues,
          materiasAnioItems,
          orientaciones,
          todasAnio,
        }) => (
          <DropdownMenuSub key={anio}>
            <DropdownMenuSubTrigger>{anio}</DropdownMenuSubTrigger>
            <DropdownMenuSubContent alignOffset={-5} sideOffset={6}>
              <ScrollArea className="pr-1">
                <div className="max-h-[max(90vh,calc(var(--radix-dropdown-menu-content-available-height)-20px))]">
                  {materiasAnioItems.map(
                    ({ value, itemText, quantity, isSelected, isDisabled }) => (
                      <DropdownMenuCheckboxItem
                        key={itemText}
                        disabled={isDisabled}
                        checked={isSelected}
                        className="w-full max-w-[calc(var(--radix-dropdown-menu-content-available-width)-20px)] cursor-pointer"
                        onCheckedChange={() => {
                          const newFilterState = updateArrFilterState(
                            value,
                            filterValue,
                          )
                          updateSearchParams([
                            { keyParam: 'materias', newState: newFilterState },
                          ])
                        }}
                      >
                        <MenuItem value={itemText} quantity={quantity} />
                      </DropdownMenuCheckboxItem>
                    ),
                  )}

                  {orientaciones && (
                    <>
                      <DropdownMenuSeparator className="mx-1 bg-muted-foreground/15" />
                      <DropdownMenuLabel className="max-w-[var(--radix-dropdown-menu-trigger-width)] py-1 pl-3 font-medium text-foreground/80">
                        Orientación
                      </DropdownMenuLabel>
                      <DropdownMenuRadioGroup
                        value={
                          (!todasAnio.isSelected &&
                            orientaciones.find(({ isSelected }) => isSelected)
                              ?.itemText) ||
                          undefined
                        }
                        onValueChange={(text) => {
                          const selectedItem = orientaciones.find(
                            ({ itemText }) => itemText === text,
                          )
                          if (selectedItem) {
                            const values = selectedItem.value
                            const newFilterState = updateArrFilterState(
                              values,
                              filterValue,
                              partialFilterValues,
                            )
                            updateSearchParams([
                              {
                                keyParam: 'materias',
                                newState: newFilterState,
                              },
                            ])
                          }
                        }}
                      >
                        {orientaciones.map(
                          ({ itemText, quantity, isDisabled }) => (
                            <DropdownMenuRadioItem
                              key={itemText}
                              value={itemText}
                              className="cursor-pointer"
                              onSelect={(e) => e.preventDefault()}
                              disabled={isDisabled}
                            >
                              <MenuItem value={itemText} quantity={quantity} />
                            </DropdownMenuRadioItem>
                          ),
                        )}
                      </DropdownMenuRadioGroup>
                    </>
                  )}

                  <DropdownMenuSeparator className="mx-1 bg-muted-foreground/15" />
                  <DropdownMenuCheckboxItem
                    className="cursor-pointer font-medium text-foreground/80"
                    disabled={todasAnio.isDisabled}
                    checked={todasAnio.isSelected}
                    onCheckedChange={() => {
                      const values = todasAnio.value
                      const newFilterState = updateArrFilterState(
                        values,
                        filterValue,
                        partialFilterValues,
                      )
                      updateSearchParams([
                        { keyParam: 'materias', newState: newFilterState },
                      ])
                    }}
                  >
                    <MenuItem
                      value={todasAnio.itemText}
                      quantity={todasAnio.quantity}
                    />
                  </DropdownMenuCheckboxItem>
                </div>
              </ScrollArea>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ),
      )}
    </div>
  )
}

export default MateriasFilterContent
