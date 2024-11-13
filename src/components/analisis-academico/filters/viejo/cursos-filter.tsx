'use client'

import useParamsState from '@/hooks/useParamsState'
import Filter from './filter'
import { Users } from 'lucide-react'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { CURSOS_ITEMS_DATA } from '@/app/analisis-academico/utils/constants'
import { FILTERS_FNS } from '@/app/analisis-academico/utils/dataOperations'
import {
  getGrupalItemData,
  getQuantity,
} from '@/app/analisis-academico/utils/urlParamsOperations'

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
    console.time('Cursos updateParams')
    let newCursosState: string[]
    if (typeof itemValue === 'string') {
      newCursosState = filterValue.includes(itemValue)
        ? filterValue.filter((prevParam) => prevParam !== itemValue)
        : [...filterValue, itemValue]
    } else {
      const distintosAnios = [...new Set(itemValue.map((curso) => curso[0]))]
      const analyzedCursos =
        distintosAnios.length > 1
          ? filterValue
          : filterValue.filter((curso) => curso[0] === distintosAnios[0])
      newCursosState =
        itemValue.every((curso) => filterValue.includes(curso)) &&
        analyzedCursos.length === itemValue.length
          ? filterValue.filter((prevCurso) => !itemValue.includes(prevCurso))
          : [
              ...new Set([
                ...filterValue.filter(
                  (curso) => !analyzedCursos.includes(curso),
                ),
                ...itemValue,
              ]),
            ]
    }
    newCursosState.length
      ? searchParams.set('cursos', newCursosState.sort().join('_'))
      : searchParams.delete('cursos')
    if (searchParams.has('page')) searchParams.delete('page')
    console.timeEnd('Cursos updateParams')
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

  const todosManiana = CURSOS_ITEMS_DATA.flatMap(
    ({ turnoManiana }) => turnoManiana,
  )
  const { isSelected: manianaIsSelected, quantity: manianaQuantity } =
    getGrupalItemData(todosManiana, filterValue, uniqueValues)

  const todosTarde = CURSOS_ITEMS_DATA.flatMap(({ turnoTarde }) => turnoTarde)
  const { isSelected: tardeIsSelected, quantity: tardeQuantity } =
    getGrupalItemData(todosTarde, filterValue, uniqueValues)

  const todosCB = CURSOS_ITEMS_DATA.flatMap(({ cursosCB }) => cursosCB)
  const { isSelected: cbIsSelected, quantity: cbQuantity } = getGrupalItemData(
    todosCB,
    filterValue,
    uniqueValues,
  )

  const todosTICS = CURSOS_ITEMS_DATA.flatMap(({ cursosTICs }) => cursosTICs)
  const { isSelected: ticsIsSelected, quantity: ticsQuantity } =
    getGrupalItemData(todosTICS, filterValue, uniqueValues)

  const todosPM = CURSOS_ITEMS_DATA.flatMap(({ cursosPM }) => cursosPM)
  const { isSelected: pmIsSelected, quantity: pmQuantity } = getGrupalItemData(
    todosPM,
    filterValue,
    uniqueValues,
  )

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
        {CURSOS_ITEMS_DATA.map(
          ({ anio, todos, turnoManiana, turnoTarde, cursosTICs, cursosPM }) => {
            const anioFilterValues = filterValue.filter(
              (curso) => curso[0] === anio[0],
            )
            const { isSelected: todosIsSelected, quantity: todosQuantity } =
              getGrupalItemData(todos, anioFilterValues, uniqueValues)

            const { isSelected: manianaIsSelected, quantity: manianaQuantity } =
              getGrupalItemData(turnoManiana, anioFilterValues, uniqueValues)

            const { isSelected: tardeIsSelected, quantity: tardeQuantity } =
              getGrupalItemData(turnoTarde, anioFilterValues, uniqueValues)

            const { isSelected: ticsIsSelected, quantity: ticsQuantity } =
              getGrupalItemData(cursosTICs, anioFilterValues, uniqueValues)

            const { isSelected: pmIsSelected, quantity: pmQuantity } =
              getGrupalItemData(cursosPM, anioFilterValues, uniqueValues)

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
                          (!todosIsSelected &&
                            ((manianaIsSelected && 'turnoManiana') ||
                              (tardeIsSelected && 'turnoTarde'))) ||
                          undefined
                        }
                        onValueChange={(value) => {
                          if (value === 'turnoManiana')
                            updateParams(turnoManiana)
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
                              (!todosIsSelected &&
                                ((ticsIsSelected && 'TICs') ||
                                  (pmIsSelected && 'Prod. Multimedial'))) ||
                              undefined
                            }
                            onValueChange={(value) => {
                              if (value === 'TICs') updateParams(cursosTICs)
                              if (value === 'Prod. Multimedial')
                                updateParams(cursosPM)
                            }}
                          >
                            <DropdownMenuRadioItem
                              value="TICs"
                              className="cursor-pointer"
                              disabled={ticsQuantity === 0 && !ticsIsSelected}
                            >
                              <MenuItem
                                value={`TICs`}
                                quantity={ticsQuantity}
                              />
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem
                              value="Prod. Multimedial"
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
                        disabled={todosQuantity === 0 && !todosIsSelected}
                        checked={todosIsSelected}
                        onCheckedChange={() => updateParams(todos)}
                      >
                        <MenuItem
                          value={`Todos los ${anio.split(' ')[0]}`}
                          quantity={todosQuantity}
                        />
                      </DropdownMenuCheckboxItem>
                    </div>
                  </ScrollArea>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )
          },
        )}
        <DropdownMenuSeparator className="mx-1 bg-muted-foreground/15" />
        <DropdownMenuLabel className="max-w-[var(--radix-dropdown-menu-trigger-width)] py-1 pl-3 font-medium text-foreground/80">
          Turnos
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={
            (manianaIsSelected && 'turnoManiana') ||
            (tardeIsSelected && 'turnoTarde') ||
            undefined
          }
          onValueChange={(value) => {
            if (value === 'turnoManiana') updateParams(todosManiana)
            if (value === 'turnoTarde') updateParams(todosTarde)
          }}
        >
          <DropdownMenuRadioItem
            value="turnoManiana"
            className="cursor-pointer"
          >
            <MenuItem value={`Turno Mañana`} quantity={manianaQuantity} />
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="turnoTarde" className="cursor-pointer">
            <MenuItem value={`Turno Tarde`} quantity={tardeQuantity} />
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator className="mx-1 bg-muted-foreground/15" />
        <DropdownMenuLabel className="max-w-[var(--radix-dropdown-menu-trigger-width)] py-1 pl-3 font-medium text-foreground/80">
          Orientación
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={
            (cbIsSelected && 'CB') ||
            (ticsIsSelected && 'TICs') ||
            (pmIsSelected && 'Prod. Multimedial') ||
            undefined
          }
          onValueChange={(value) => {
            if (value === 'CB') updateParams(todosCB)
            if (value === 'TICs') updateParams(todosTICS)
            if (value === 'Prod. Multimedial') updateParams(todosPM)
          }}
        >
          <DropdownMenuRadioItem
            value="CB"
            className="cursor-pointer"
            disabled={cbQuantity === 0 && !cbIsSelected}
          >
            <MenuItem value={`Ciclo Básico`} quantity={cbQuantity} />
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="TICs"
            className="cursor-pointer"
            disabled={ticsQuantity === 0 && !ticsIsSelected}
          >
            <MenuItem value={`TICs`} quantity={ticsQuantity} />
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="Prod. Multimedial"
            className="cursor-pointer"
            disabled={pmQuantity === 0 && !pmIsSelected}
          >
            <MenuItem value={`Prod. Multimedial`} quantity={pmQuantity} />
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </div>
    </Filter>
  )
}

export default CursosFilter
