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
import { type ParamsValues } from '@/app/analisis-academico/page'
import { updateArrParamState } from '@/app/analisis-academico/utils/urlParamsOperations'
import { isValidKey } from '@/lib/typeGuards'
import { ScrollArea } from '@/components/ui/scroll-area'

type itemData = {
  value: string[] | string
  isSelected?: boolean
  quantity?: number
}

type GroupValues<T extends string> = Record<T, itemData>

interface CursosFilterContentProps {
  filterValue: string[]
  paramsValues: ParamsValues
  uniqueValues?: Map<any, number>
  cursosAnioData: ({
    anio: string
    anioFilterValues: string[]
    cursosData: itemData[]
  } & GroupValues<'maniana' | 'tarde' | 'tics' | 'pm' | 'todos'>)[]
  todosValuesData: GroupValues<'maniana' | 'tarde' | 'cb' | 'tics' | 'pm'>
}

export function CursosFilterContent({
  filterValue,
  paramsValues,
  uniqueValues,
  cursosAnioData,
  todosValuesData,
}: CursosFilterContentProps) {
  const { maniana, tarde, cb, tics, pm } = todosValuesData
  const { updateSearchParams } = useStateInUrl()

  return (
    <div className="text-xs lg:text-sm">
      {cursosAnioData.map((anioData) => {
        const {
          anio,
          anioFilterValues,
          cursosData,
          maniana,
          tarde,
          tics,
          pm,
          todos,
        } = anioData
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
                  {cursosData.map(({ value, isSelected, quantity }) => (
                    <DropdownMenuCheckboxItem
                      key={`${value}`}
                      className="cursor-pointer"
                      disabled={quantity === 0 && !isSelected}
                      checked={isSelected}
                      onCheckedChange={() => {
                        const newParamsValues = {
                          ...paramsValues,
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
                      if (
                        isValidKey<
                          GroupValues<
                            'maniana' | 'tarde' | 'tics' | 'pm' | 'todos'
                          >
                        >(groupKey)
                      ) {
                        const values = anioData[groupKey].value
                        const newParamsValues = {
                          ...paramsValues,
                          cursos: updateArrParamState(
                            values,
                            filterValue,
                            anioFilterValues,
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
          if (isValidKey<typeof todosValuesData>(groupKey)) {
            const values = todosValuesData[groupKey].value
            const newParamsValues = {
              ...paramsValues,
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
          (cb.isSelected && 'CB') ||
          (tics.isSelected && 'TICs') ||
          (pm.isSelected && 'PM') ||
          undefined
        }
        onValueChange={(groupKey) => {
          if (isValidKey<typeof todosValuesData>(groupKey)) {
            const values = todosValuesData[groupKey].value
            const newParamsValues = {
              ...paramsValues,
              cursos: updateArrParamState(values, filterValue),
            }
            updateSearchParams(newParamsValues)
          }
        }}
      >
        <DropdownMenuRadioItem
          value="CB"
          className="cursor-pointer"
          disabled={cb.quantity === 0 && !cb.isSelected}
        >
          <MenuItem value={`Ciclo Básico`} quantity={cb.quantity} />
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem
          value="TICs"
          className="cursor-pointer"
          disabled={tics.quantity === 0 && !tics.isSelected}
        >
          <MenuItem value={`TICs`} quantity={tics.quantity} />
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem
          value="PM"
          className="cursor-pointer"
          disabled={pm.quantity === 0 && !pm.isSelected}
        >
          <MenuItem value={`Prod. Multimedial`} quantity={pm.quantity} />
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </div>
  )
}
