import { SearchParams } from '@/app/analisis-academico/page'
import {
  FILTERS_FNS,
  getGrupalItemData,
  getQuantity,
  getStudentsUniqueValues,
} from '@/app/analisis-academico/utils/dataOperations'
import { Student } from '@/lib/definitions'
import { Users } from 'lucide-react'
import { CURSOS_ITEMS_DATA } from '@/app/analisis-academico/utils/constants'
import { updateArrParamState } from '@/app/analisis-academico/utils/urlParamsOperations'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import Filter from '../filter'

export interface TableFilterProps {
  searchParams: SearchParams
  data?: Student[]
}

function CursosFilter({ searchParams, data }: TableFilterProps) {
  const uniqueValues =
    data && getStudentsUniqueValues(data, searchParams, 'cursos')
  const filterValue = FILTERS_FNS.cursos.formatParam(searchParams.cursos)
  const filterTags = filterValue.map((value) => {
    const tagText = value
    const quantity = getQuantity(value, uniqueValues)
    const newQueryState = {
      ...searchParams,
      cursos: updateArrParamState(value, filterValue),
    }
    return { value, tagText, quantity, newQueryState }
  })

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
      filterTags={filterTags}
      paramKeys={['cursos']}
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
                            checked={cursoIsSelected}
                          >
                            <MenuItem
                              value={curso}
                              quantity={cursoQuantity}
                              paramKeys={['cursos']}
                              newQueryState={{
                                ...searchParams,
                                cursos: updateArrParamState(curso, filterValue),
                              }}
                            />
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
                      >
                        <DropdownMenuRadioItem
                          value="turnoManiana"
                          className="cursor-pointer"
                          disabled={manianaQuantity === 0 && !manianaIsSelected}
                        >
                          <MenuItem
                            value={`Turno Mañana`}
                            quantity={manianaQuantity}
                            paramKeys={['cursos']}
                            newQueryState={{
                              ...searchParams,
                              cursos: updateArrParamState(
                                turnoManiana,
                                filterValue,
                                anioFilterValues,
                              ),
                            }}
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
                            paramKeys={['cursos']}
                            newQueryState={{
                              ...searchParams,
                              cursos: updateArrParamState(
                                turnoTarde,
                                filterValue,
                                anioFilterValues,
                              ),
                            }}
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
                          >
                            <DropdownMenuRadioItem
                              value="TICs"
                              className="cursor-pointer"
                              disabled={ticsQuantity === 0 && !ticsIsSelected}
                            >
                              <MenuItem
                                value={`TICs`}
                                quantity={ticsQuantity}
                                paramKeys={['cursos']}
                                newQueryState={{
                                  ...searchParams,
                                  cursos: updateArrParamState(
                                    cursosTICs,
                                    filterValue,
                                    anioFilterValues,
                                  ),
                                }}
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
                                paramKeys={['cursos']}
                                newQueryState={{
                                  ...searchParams,
                                  cursos: updateArrParamState(
                                    cursosPM,
                                    filterValue,
                                    anioFilterValues,
                                  ),
                                }}
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
                      >
                        <MenuItem
                          value={`Todos los ${anio.split(' ')[0]}`}
                          quantity={todosQuantity}
                          paramKeys={['cursos']}
                          newQueryState={{
                            ...searchParams,
                            cursos: updateArrParamState(
                              todos,
                              filterValue,
                              anioFilterValues,
                            ),
                          }}
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
        >
          <DropdownMenuRadioItem
            value="turnoManiana"
            className="cursor-pointer"
            disabled={manianaQuantity === 0 && !manianaIsSelected}
          >
            <MenuItem
              value={`Turno Mañana`}
              quantity={manianaQuantity}
              paramKeys={['cursos']}
              newQueryState={{
                ...searchParams,
                cursos: updateArrParamState(todosManiana, filterValue),
              }}
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
              paramKeys={['cursos']}
              newQueryState={{
                ...searchParams,
                cursos: updateArrParamState(todosTarde, filterValue),
              }}
            />
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
        >
          <DropdownMenuRadioItem
            value="CB"
            className="cursor-pointer"
            disabled={cbQuantity === 0 && !cbIsSelected}
          >
            <MenuItem
              value={`Ciclo Básico`}
              quantity={cbQuantity}
              paramKeys={['cursos']}
              newQueryState={{
                ...searchParams,
                cursos: updateArrParamState(todosCB, filterValue),
              }}
            />
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="TICs"
            className="cursor-pointer"
            disabled={ticsQuantity === 0 && !ticsIsSelected}
          >
            <MenuItem
              value={`TICs`}
              quantity={ticsQuantity}
              paramKeys={['cursos']}
              newQueryState={{
                ...searchParams,
                cursos: updateArrParamState(todosTICS, filterValue),
              }}
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
              paramKeys={['cursos']}
              newQueryState={{
                ...searchParams,
                cursos: updateArrParamState(todosPM, filterValue),
              }}
            />
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </div>
    </Filter>
  )
}

export default CursosFilter
