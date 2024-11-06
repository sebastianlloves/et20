'use client'

import useParamsState from '@/hooks/useParamsState'
import Filter from './filter'
import { Users } from 'lucide-react'
import { CURSOS } from '@/lib/constants'
import {
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import MenuItem from './menu-item'

function CursosFilter({
  uniqueValues,
}: {
  uniqueValues?: Map<string, number>
}) {
  const { pathname, searchParams, replace } = useParamsState()
  const cursosValue = searchParams.get('cursos')?.split('_') || []
  const cursosTags = cursosValue.sort().map((value) => {
    const quantity = uniqueValues && (uniqueValues.get(value) ?? 0)
    return { value, quantity }
  })

  const CURSOS_DATA = (Object.keys(CURSOS) as Array<keyof typeof CURSOS>).map(
    (anio) => {
      const todos = CURSOS[anio].map(({ curso }) => curso)
      const turnoManiana = CURSOS[anio]
        .filter(({ turno }) => turno === 'Mañana')
        .map(({ curso }) => curso)
      const turnoTarde = CURSOS[anio]
        .filter(({ turno }) => turno === 'Tarde')
        .map(({ curso }) => curso)
      const cursosTICs = CURSOS[anio]
        .filter(({ orientacion }) => orientacion === 'TICs')
        .map(({ curso }) => curso)
      const cursosPM = CURSOS[anio]
        .filter(({ orientacion }) => orientacion === 'Producción Multimedial')
        .map(({ curso }) => curso)
      return { anio, todos, turnoManiana, turnoTarde, cursosTICs, cursosPM }
    },
  )

  const updateParams = (itemValue: string | string[]) => {
    let newCursosState: string[]
    if (typeof itemValue === 'string') {
      newCursosState = cursosValue.includes(itemValue)
        ? cursosValue.filter((prevParam) => prevParam !== itemValue)
        : [...cursosValue, itemValue]
    } else {
      newCursosState = itemValue.every((curso) => cursosValue.includes(curso))
        ? cursosValue.filter((prevParam) => !itemValue.includes(prevParam))
        : [...new Set([...cursosValue, ...itemValue])]
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
    const newState = cursosValue.filter((prevValue) => prevValue !== value)
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
            const todosQuantity = getQuantity(todos, uniqueValues)
            const todosIsCheked = todos.every((curso) =>
              cursosValue.includes(curso),
            )
            const manianaQuantity = getQuantity(turnoManiana, uniqueValues)
            const manianaIsChecked = turnoManiana.every((curso) =>
              cursosValue.includes(curso),
            )
            const tardeQuantity = getQuantity(turnoTarde, uniqueValues)
            const tardeIsChecked = turnoTarde.every((curso) =>
              cursosValue.includes(curso),
            )
            const ticsQuantity =
              cursosTICs.length > 0
                ? getQuantity(cursosTICs, uniqueValues)
                : undefined
            const ticsIsChecked =
              cursosTICs.length > 0 &&
              cursosTICs.every((curso) => cursosValue.includes(curso))
            const pmQuantity =
              cursosPM.length > 0
                ? getQuantity(cursosPM, uniqueValues)
                : undefined
            const pmIsChecked =
              cursosPM.length > 0 &&
              cursosPM.every((curso) => cursosValue.includes(curso))

            return (
              <DropdownMenuSub key={anio}>
                <DropdownMenuSubTrigger className="pl-3">
                  {anio}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent alignOffset={-5} sideOffset={6}>
                  {todos.map((curso) => {
                    const cursoQuantity = getQuantity(curso, uniqueValues)
                    const cursoIsChecked = cursosValue.includes(curso)
                    return (
                      <DropdownMenuCheckboxItem
                        key={curso}
                        className="cursor-pointer"
                        disabled={cursoQuantity === 0 && !cursoIsChecked}
                        onSelect={(e) => e.preventDefault()}
                        checked={cursoIsChecked}
                        onCheckedChange={() => updateParams(curso)}
                      >
                        <MenuItem value={curso} quantity={cursoQuantity} />
                      </DropdownMenuCheckboxItem>
                    )
                  })}
                  <DropdownMenuSeparator className="mx-1 bg-muted-foreground/15" />
                  <DropdownMenuCheckboxItem
                    className="cursor-pointer"
                    disabled={manianaQuantity === 0 && !manianaIsChecked}
                    checked={manianaIsChecked}
                    onCheckedChange={() => updateParams(turnoManiana)}
                  >
                    <MenuItem
                      value={`Turno Mañana`}
                      quantity={manianaQuantity}
                    />
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    className="cursor-pointer"
                    disabled={tardeQuantity === 0 && !tardeIsChecked}
                    checked={tardeIsChecked}
                    onCheckedChange={() => updateParams(turnoTarde)}
                  >
                    <MenuItem value={`Turno Tarde`} quantity={tardeQuantity} />
                  </DropdownMenuCheckboxItem>
                  {cursosPM.length > 0 && cursosTICs.length > 0 && (
                    <>
                      <DropdownMenuSeparator className="mx-1 bg-muted-foreground/15" />
                      <DropdownMenuCheckboxItem
                        className="cursor-pointer"
                        disabled={ticsQuantity === 0 && !ticsIsChecked}
                        checked={ticsIsChecked}
                        onCheckedChange={() => updateParams(cursosTICs)}
                      >
                        <MenuItem
                          value={`TICs`}
                          quantity={ticsQuantity}
                        />
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        className="cursor-pointer"
                        disabled={pmQuantity === 0 && !pmIsChecked}
                        checked={pmIsChecked}
                        onCheckedChange={() => updateParams(cursosPM)}
                      >
                        <MenuItem
                          value={`Producción Multimedia`}
                          quantity={pmQuantity}
                        />
                      </DropdownMenuCheckboxItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="mx-1 bg-muted-foreground/15" />
                  <DropdownMenuCheckboxItem
                    className="cursor-pointer"
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
