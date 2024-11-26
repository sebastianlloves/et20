'use client'

import {
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import MenuItem from '../menu-item'
import useParamsState from '@/hooks/useParamsState'
import { type ParamsValues } from '@/app/analisis-academico/page'
import { updateArrParamState } from '@/app/analisis-academico/utils/urlParamsOperations'

interface CursosFilterContentProps {
  cursosItemsData: {
    anio: '1° año' | '2° año' | '3° año' | '4° año' | '5° año' | '6° año'
    todos: string[]
    turnoManiana: string[]
    turnoTarde: string[]
    cursosCB: string[]
    cursosTICs: string[]
    cursosPM: string[]
  }[]
  filterValue: string[]
  paramsValues: ParamsValues
  uniqueValues?: Map<any, number>
  groupsValuesData: Record<
    'maniana' | 'tarde' | 'CB' | 'TICs' | 'PM',
    { todos: string[]; isSelected?: boolean; quantity?: number }
  >
}

export function CursosFilterContent({
  cursosItemsData,
  filterValue,
  paramsValues,
  uniqueValues,
  groupsValuesData,
}: CursosFilterContentProps) {
  const { maniana, tarde } = groupsValuesData
  const { pathname, replace } = useParamsState()
  const newSearchParams = new URLSearchParams()
  const updateSearchParams = (newParamsValues: ParamsValues) => {
    const paramsKeys = Object.keys(paramsValues) as Array<keyof ParamsValues>
    console.log(paramsKeys)
    paramsKeys.forEach((paramKey) => {
      const paramValue = newParamsValues[paramKey]
      if (Array.isArray(paramValue)) {
        paramValue.length > 0
          ? newSearchParams.set(paramKey, paramValue.join('_'))
          : newSearchParams.delete(paramKey)
      }
      if (typeof paramValue === 'string')
        newSearchParams.set(paramKey, paramValue)
      if (newSearchParams.has('page')) newSearchParams.delete('page')
      replace(`${pathname}?${newSearchParams.toString()}`)
    })
  }

  return (
    <div className="text-xs lg:text-sm">
      <DropdownMenuSeparator className="mx-1 bg-muted-foreground/15" />

      <DropdownMenuLabel className="max-w-[var(--radix-dropdown-menu-trigger-width)] py-1 pl-3 font-medium text-foreground/80">
        Turnos
      </DropdownMenuLabel>
      <DropdownMenuRadioGroup
        value={
          (maniana.isSelected && 'turnoManiana') ||
          (tarde.isSelected && 'turnoTarde') ||
          undefined
        }
        onValueChange={(value) => {
          const todos = value === 'turnoManiana' ? maniana.todos : tarde.todos
          const newParamsValues = {
            ...paramsValues,
            cursos: updateArrParamState(todos, filterValue),
          }
          updateSearchParams(newParamsValues)
        }}
      >
        <DropdownMenuRadioItem
          value="turnoManiana"
          className="cursor-pointer"
          disabled={maniana.quantity === 0 && !maniana.quantity}
        >
          <MenuItem value={`Turno Mañana`} quantity={maniana.quantity} />
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem
          value="turnoTarde"
          className="cursor-pointer"
          disabled={tarde.quantity === 0 && !tarde.quantity}
        >
          <MenuItem value={`Turno Tarde`} quantity={tarde.quantity} />
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </div>
  )
}
