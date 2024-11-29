'use client'

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
import MenuItem from '../menu-item'
import { useStateInUrl } from '@/hooks/useParamsState'
import { updateArrParamState } from '@/app/analisis-academico/utils/urlParamsOperations'
import { isKeyOfObject } from '@/lib/typeGuards'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AllFiltersValues } from '@/app/analisis-academico/utils/definitions'

type itemData = {
  value: string[] | string
  isSelected?: boolean
  quantity?: number
}

type GroupValues<T extends string> = Record<T, itemData>

interface CursosFilterContentProps {
  filterValue: string[]
  allFiltersValues: AllFiltersValues
  cursosAnioData: {
    anio: string
    partialFilterValues: string[]
    cursosAnioItems: itemData[]
    anioGroupItems: GroupValues<'maniana' | 'tarde' | 'tics' | 'pm' | 'todos'>
  }[]
  todosValuesData: GroupValues<'maniana' | 'tarde' | 'cb' | 'tics' | 'pm'>
}

export function CursosFilterContent({
  filterValue,
  allFiltersValues,
  cursosAnioData,
  todosValuesData,
}: CursosFilterContentProps) {
  const { maniana, tarde, cb, tics, pm } = todosValuesData
  const { updateSearchParams } = useStateInUrl()

  return (
    <div className="text-xs lg:text-sm">
      {cursosAnioData.map((anioData) => {
        const { anio, partialFilterValues, cursosAnioItems, anioGroupItems } =
          anioData
        const { maniana, tarde, tics, pm, todos } = anioGroupItems
        return (
          <DropdownMenuSub key={anio}>
            <DropdownMenuSubTrigger className="pl-3">
              {anio}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent alignOffset={-5} sideOffset={6}>
              <ScrollArea className="pr-1">
                <div className="max-h-[max(90vh,calc(var(--radix-dropdown-menu-content-available-height)-20px))]">
                  <DropdownMenuLabel className="max-w-[var(--radix-dropdown-menu-trigger-width)] py-1 pl-3 font-medium text-foreground/80">
                    Específicos
                  </DropdownMenuLabel>
                  {cursosAnioItems.map(({ value, isSelected, quantity }) => (
                    <DropdownMenuCheckboxItem
                      key={`${value}`}
                      className="cursor-pointer"
                      disabled={quantity === 0 && !isSelected}
                      checked={isSelected}
                      onCheckedChange={() => {
                        const newParamsValues = {
                          ...allFiltersValues,
                          cursos: updateArrParamState(value, filterValue),
                        }
                        updateSearchParams(newParamsValues)
                      }}
                    >
                      <MenuItem value={`${value}`} quantity={quantity} />
                    </DropdownMenuCheckboxItem>
                  ))}

                  <DropdownMenuSeparator className="mx-1 bg-muted-foreground/10" />
                  <DropdownMenuLabel className="max-w-[var(--radix-dropdown-menu-trigger-width)] py-1 pl-3 font-medium text-foreground/80">
                    Turnos
                  </DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={
                      (!todos.isSelected &&
                        ((maniana.isSelected && 'maniana') ||
                          (tarde.isSelected && 'tarde'))) ||
                      undefined
                    }
                    onValueChange={(groupKey) => {
                      if (isKeyOfObject(groupKey, anioGroupItems)) {
                        const values = anioGroupItems[groupKey].value
                        const newParamsValues = {
                          ...allFiltersValues,
                          cursos: updateArrParamState(
                            values,
                            filterValue,
                            partialFilterValues,
                          ),
                        }
                        updateSearchParams(newParamsValues)
                      }
                    }}
                  >
                    <DropdownMenuRadioItem
                      value="maniana"
                      className="cursor-pointer"
                      disabled={maniana.quantity === 0 && !maniana.isSelected}
                    >
                      <MenuItem
                        value={`Turno Mañana`}
                        quantity={maniana.quantity}
                      />
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="tarde"
                      className="cursor-pointer"
                      disabled={tarde.quantity === 0 && !tarde.isSelected}
                    >
                      <MenuItem
                        value={`Turno Tarde`}
                        quantity={tarde.quantity}
                      />
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>

                  {tics.value.length > 0 && pm.value.length > 0 && (
                    <>
                      <DropdownMenuSeparator className="mx-1 bg-muted-foreground/10" />
                      <DropdownMenuLabel className="max-w-[var(--radix-dropdown-menu-trigger-width)] py-1 pl-3 font-medium text-foreground/80">
                        Orientación
                      </DropdownMenuLabel>
                      <DropdownMenuRadioGroup
                        value={
                          (!todos.isSelected &&
                            ((tics.isSelected && 'tics') ||
                              (pm.isSelected && 'pm'))) ||
                          undefined
                        }
                        onValueChange={(groupKey) => {
                          if (isKeyOfObject(groupKey, anioGroupItems)) {
                            const values = anioGroupItems[groupKey].value
                            const newParamsValues = {
                              ...allFiltersValues,
                              cursos: updateArrParamState(
                                values,
                                filterValue,
                                partialFilterValues,
                              ),
                            }
                            updateSearchParams(newParamsValues)
                          }
                        }}
                      >
                        <DropdownMenuRadioItem
                          value="tics"
                          className="cursor-pointer"
                          disabled={tics.quantity === 0 && !tics.isSelected}
                        >
                          <MenuItem value={`TICs`} quantity={tics.quantity} />
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem
                          value="pm"
                          className="cursor-pointer"
                          disabled={pm.quantity === 0 && !pm.isSelected}
                        >
                          <MenuItem
                            value={`Prod. Multimedial`}
                            quantity={pm.quantity}
                          />
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </>
                  )}

                  <DropdownMenuSeparator className="mx-1 bg-muted-foreground/15" />
                  <DropdownMenuCheckboxItem
                    className="cursor-pointer font-medium text-foreground/80"
                    disabled={todos.quantity === 0 && !todos.isSelected}
                    checked={todos.isSelected}
                    onCheckedChange={() => {
                      const newParamsValues = {
                        ...allFiltersValues,
                        cursos: updateArrParamState(
                          todos.value,
                          filterValue,
                          partialFilterValues,
                        ),
                      }
                      updateSearchParams(newParamsValues)
                    }}
                  >
                    <MenuItem
                      value={`Todos los ${anio.split(' ')[0]}`}
                      quantity={todos.quantity}
                    />
                  </DropdownMenuCheckboxItem>
                </div>
              </ScrollArea>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )
      })}

      <DropdownMenuSeparator className="mx-1 bg-muted-foreground/15" />

      <DropdownMenuLabel className="max-w-[var(--radix-dropdown-menu-trigger-width)] py-1 pl-3 font-medium text-foreground/80">
        Turnos
      </DropdownMenuLabel>
      <DropdownMenuRadioGroup
        value={
          (maniana.isSelected && 'maniana') ||
          (tarde.isSelected && 'tarde') ||
          undefined
        }
        onValueChange={(groupKey) => {
          if (isKeyOfObject(groupKey, todosValuesData)) {
            const values = todosValuesData[groupKey].value
            const newParamsValues = {
              ...allFiltersValues,
              cursos: updateArrParamState(values, filterValue),
            }
            updateSearchParams(newParamsValues)
          }
        }}
      >
        <DropdownMenuRadioItem
          value="maniana"
          className="cursor-pointer"
          disabled={maniana.quantity === 0 && !maniana.quantity}
        >
          <MenuItem value={`Turno Mañana`} quantity={maniana.quantity} />
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem
          value="tarde"
          className="cursor-pointer"
          disabled={tarde.quantity === 0 && !tarde.quantity}
        >
          <MenuItem value={`Turno Tarde`} quantity={tarde.quantity} />
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>

      <DropdownMenuSeparator className="mx-1 bg-muted-foreground/15" />
      <DropdownMenuLabel className="max-w-[var(--radix-dropdown-menu-trigger-width)] py-1 pl-3 font-medium text-foreground/80">
        Orientación
      </DropdownMenuLabel>
      <DropdownMenuRadioGroup
        value={
          (cb.isSelected && 'cb') ||
          (tics.isSelected && 'tics') ||
          (pm.isSelected && 'pm') ||
          undefined
        }
        onValueChange={(groupKey) => {
          if (isKeyOfObject(groupKey, todosValuesData)) {
            const values = todosValuesData[groupKey].value
            const newParamsValues = {
              ...allFiltersValues,
              cursos: updateArrParamState(values, filterValue),
            }
            updateSearchParams(newParamsValues)
          }
        }}
      >
        <DropdownMenuRadioItem
          value="cb"
          className="cursor-pointer"
          disabled={cb.quantity === 0 && !cb.isSelected}
        >
          <MenuItem value={`Ciclo Básico`} quantity={cb.quantity} />
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem
          value="tics"
          className="cursor-pointer"
          disabled={tics.quantity === 0 && !tics.isSelected}
        >
          <MenuItem value={`TICs`} quantity={tics.quantity} />
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem
          value="pm"
          className="cursor-pointer"
          disabled={pm.quantity === 0 && !pm.isSelected}
        >
          <MenuItem value={`Prod. Multimedial`} quantity={pm.quantity} />
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </div>
  )
}
