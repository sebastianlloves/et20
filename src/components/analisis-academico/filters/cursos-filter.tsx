'use client'

import useParamsState from '@/hooks/useParamsState'
import Filter from './filter'
import { Users } from 'lucide-react'
import { CURSOS_DATA } from '@/lib/constants'
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
import MenuItem from './menu-item'
import { FILTERS_FNS } from '@/lib/utils'

function CursosFilter({
  uniqueValues,
}: {
  uniqueValues?: Map<string, number>
}) {
  const { pathname, searchParams, replace } = useParamsState()

  const filterValue = FILTERS_FNS.cursos.formatParam(searchParams.get('cursos'))
  const cursosTags = filterValue.sort().map((value) => {
    const quantity = uniqueValues && (uniqueValues.get(value) ?? 0)
    return { value, quantity }
  })

  const updateParams = (itemValue: string | string[]) => {
    let newCursosState: string[]
    if (typeof itemValue === 'string') {
      newCursosState = filterValue.includes(itemValue)
        ? filterValue.filter((prevParam) => prevParam !== itemValue)
        : [...filterValue, itemValue]
    } else {
      const anio = itemValue[0][0]
      const anioFilterValue = filterValue.filter((curso) => curso[0] === anio)
      newCursosState =
        itemValue.every((curso) => filterValue.includes(curso)) &&
        anioFilterValue.length === itemValue.length
          ? filterValue.filter((prevCurso) => !itemValue.includes(prevCurso))
          : [
              ...new Set([
                ...filterValue.filter(
                  (curso) => !anioFilterValue.includes(curso),
                ),
                ...itemValue,
              ]),
            ]
    }
    newCursosState.length
      ? searchParams.set('cursos', newCursosState.sort().join('_'))
      : searchParams.delete('cursos')
    if (searchParams.has('page')) searchParams.delete('page')
    replace(`${pathname}?${searchParams.toString()}`)
  }

  const handleRemoveAll = () => {
    searchParams.delete('cursos')
    if (searchParams.has('page')) searchParams.delete('page')
    replace(`${pathname}?${searchParams}`)
  }

  const handleRemoveTag = (value: string) => {
    const newState = filterValue.filter((prevValue) => prevValue !== value)
    newState.length
      ? searchParams.set('cursos', newState.join('_'))
      : searchParams.delete('cursos')
    if (searchParams.has('page')) searchParams.delete('page')
    replace(`${pathname}?${searchParams}`)
  }

  return (
    <Filter
      title="Cursos"
      maxTags={3}
      icon={<Users strokeWidth={1.4} className="w-[14px] lg:w-[15px]" />}
      filterTags={cursosTags}
      handleRemoveTag={handleRemoveTag}
      handleRemoveAll={handleRemoveAll}
    >
      <div className="text-xs lg:text-sm">
        {CURSOS_DATA.map(
          ({ anio, todos, turnoManiana, turnoTarde, cursosTICs, cursosPM }) => {
            const anioFilterValue = filterValue.filter(
              (curso) => curso[0] === anio[0],
            )
            const todosQuantity = getQuantity(todos, uniqueValues)
            const todosIsCheked = todos.every((curso) =>
              filterValue.includes(curso),
            )
            const manianaIsSelected =
              anioFilterValue.length === turnoManiana.length &&
              turnoManiana.every((curso) => filterValue.includes(curso))
            const manianaQuantity = getQuantity(turnoManiana, uniqueValues)
            const tardeIsSelected =
              anioFilterValue.length === turnoTarde.length &&
              turnoTarde.every((curso) => filterValue.includes(curso))
            const tardeQuantity = getQuantity(turnoTarde, uniqueValues)
            const ticsIsSelected =
              cursosTICs.length > 0 &&
              anioFilterValue.length === cursosTICs.length &&
              cursosTICs.every((curso) => filterValue.includes(curso))
            const ticsQuantity =
              cursosTICs.length > 0
                ? getQuantity(cursosTICs, uniqueValues)
                : undefined
            const pmIsSelected =
              cursosPM.length > 0 &&
              anioFilterValue.length === cursosPM.length &&
              cursosPM.every((curso) => filterValue.includes(curso))
            const pmQuantity =
              cursosPM.length > 0
                ? getQuantity(cursosPM, uniqueValues)
                : undefined

            return (
              <DropdownMenuSub key={anio}>
                <DropdownMenuSubTrigger className="pl-3">
                  {anio}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent alignOffset={-5} sideOffset={6}>
                  <DropdownMenuLabel className="max-w-[var(--radix-dropdown-menu-trigger-width)] py-1 pl-3 font-medium text-foreground/80">
                    Específicos
                  </DropdownMenuLabel>
                  {todos.map((curso) => {
                    const cursoQuantity = getQuantity(curso, uniqueValues)
                    const cursoIsSelected = filterValue.includes(curso)
                    return (
                      <DropdownMenuCheckboxItem
                        key={curso}
                        className="cursor-pointer"
                        disabled={cursoQuantity === 0 && !cursoIsSelected}
                        onSelect={(e) => e.preventDefault()}
                        checked={cursoIsSelected}
                        onCheckedChange={() => updateParams(curso)}
                      >
                        <MenuItem value={curso} quantity={cursoQuantity} />
                      </DropdownMenuCheckboxItem>
                    )
                  })}
                  <DropdownMenuSeparator className="mx-1 bg-muted-foreground/10" />
                  <DropdownMenuLabel className="max-w-[var(--radix-dropdown-menu-trigger-width)] py-1 pl-3 font-medium text-foreground/80">
                    Turnos
                  </DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={
                      (!todosIsCheked &&
                        ((manianaIsSelected && 'turnoManiana') ||
                          (tardeIsSelected && 'turnoTarde'))) ||
                      undefined
                    }
                    onValueChange={(value) => {
                      if (value === 'turnoManiana') updateParams(turnoManiana)
                      if (value === 'turnoTarde') updateParams(turnoTarde)
                    }}
                  >
                    <DropdownMenuRadioItem
                      value="turnoManiana"
                      className="cursor-pointer"
                      disabled={manianaQuantity === 0 && !manianaIsSelected}
                    >
                      <MenuItem
                        value={`Turno Mañana`}
                        quantity={manianaQuantity}
                      />
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="turnoTarde"
                      className="cursor-pointer"
                      disabled={tardeQuantity === 0 && !tardeIsSelected}
                    >
                      <MenuItem
                        value={`Turno Tarde`}
                        quantity={tardeQuantity}
                      />
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  {cursosPM.length > 0 && cursosTICs.length > 0 && (
                    <>
                      <DropdownMenuSeparator className="mx-1 bg-muted-foreground/10" />
                      <DropdownMenuLabel className="max-w-[var(--radix-dropdown-menu-trigger-width)] py-1 pl-3 font-medium text-foreground/80">
                        Orientación
                      </DropdownMenuLabel>
                      <DropdownMenuRadioGroup
                        value={
                          (!todosIsCheked &&
                            ((ticsIsSelected && 'TICs') ||
                              (pmIsSelected && 'Producción Multimedial'))) ||
                          undefined
                        }
                        onValueChange={(value) => {
                          if (value === 'TICs') updateParams(cursosTICs)
                          if (value === 'Producción Multimedial')
                            updateParams(cursosPM)
                        }}
                      >
                        <DropdownMenuRadioItem
                          value="TICs"
                          className="cursor-pointer"
                          disabled={ticsQuantity === 0 && !ticsIsSelected}
                        >
                          <MenuItem value={`TICs`} quantity={ticsQuantity} />
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem
                          value="Producción Multimedial"
                          className="cursor-pointer"
                          disabled={pmQuantity === 0 && !pmIsSelected}
                        >
                          <MenuItem
                            value={`Prod. Multimedial`}
                            quantity={pmQuantity}
                          />
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </>
                  )}
                  <DropdownMenuSeparator className="mx-1 bg-muted-foreground/15" />
                  <DropdownMenuCheckboxItem
                    className="cursor-pointer font-medium text-foreground/80"
                    disabled={todosQuantity === 0 && !todosIsCheked}
                    checked={todosIsCheked}
                    onCheckedChange={() => updateParams(todos)}
                  >
                    <MenuItem
                      value={`Todos los ${anio.split(' ')[0]}`}
                      quantity={todosQuantity}
                    />
                  </DropdownMenuCheckboxItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )
          },
        )}
      </div>
    </Filter>
  )
}

export default CursosFilter

const getQuantity = (
  value: string | string[],
  uniqueValues?: Map<string, number>,
) => {
  if (typeof value === 'string')
    return uniqueValues && (uniqueValues.get(value) ?? 0)
  return (
    uniqueValues &&
    value.reduce(
      (prevCurso, newCurso) => prevCurso + (uniqueValues.get(newCurso) ?? 0),
      0,
    )
  )
}
