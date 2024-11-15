import { Book } from 'lucide-react'
import Filter from '../filter'
import { TableFilterProps } from './cursos-filter'
import {
  FILTERS_FNS,
  getGrupalItemData,
  getQuantity,
  getStudentsUniqueValues,
} from '@/app/analisis-academico/utils/dataOperations'
import {
  formatArrValuesParam,
  updateArrParamState,
} from '@/app/analisis-academico/utils/urlParamsOperations'
import { MATERIAS_ITEMS_DATA } from '@/app/analisis-academico/utils/constants'
import {
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import MenuItem from '../menu-item'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import Link from 'next/link'
import { ScrollArea } from '@/components/ui/scroll-area'

function MateriasFilter({ searchParams, data }: TableFilterProps) {
  const uniqueValues =
    data &&
    getStudentsUniqueValues(
      data,
      searchParams,
      'materias',
      searchParams.inclusionEstricta === 'true',
    )
  const filterValue = formatArrValuesParam(
    searchParams.materias,
    MATERIAS_ITEMS_DATA.flatMap(({ todas }) => todas),
    FILTERS_FNS.materias.sortParam,
  )
  const strictInclusionValue = searchParams.inclusionEstricta

  const strictInclusionTag = strictInclusionValue === 'true' && {
    value: strictInclusionValue,
    tagText: 'Inclusión estricta',
    quantity: null,
    pathname: '/analisis-academico',
    query: { ...searchParams, inclusionEstricta: undefined },
    className: 'rounded-lg pl-1 bg-primary/15',
  }
  const filterTags = [
    strictInclusionTag,
    ...filterValue.map((value) => {
      const tagText = value
      const quantity = getQuantity(value, uniqueValues)
      const pathname = '/analisis-academico'
      const query = {
        ...searchParams,
        materias: updateArrParamState(value, filterValue),
      }
      return { value, tagText, quantity, pathname, query }
    }),
  ].filter((value) => !!value)

  const removeFilter = {
    pathname: '/analisis-academico',
    query: {
      ...searchParams,
      materias: undefined,
      inclusionEstricta: undefined,
    },
  }

  const todasCB = MATERIAS_ITEMS_DATA.flatMap(({ materiasCB }) => materiasCB)
  const { isSelected: cbIsSelected, quantity: cbQuantity } = getGrupalItemData(
    todasCB,
    filterValue,
    uniqueValues,
  )
  const todasTICS = MATERIAS_ITEMS_DATA.flatMap(
    ({ materiasTICs }) => materiasTICs,
  )
  const { isSelected: ticsIsSelected, quantity: ticsQuantity } =
    getGrupalItemData(todasTICS, filterValue, uniqueValues)

  const todasPM = MATERIAS_ITEMS_DATA.flatMap(({ materiasPM }) => materiasPM)
  const { isSelected: pmIsSelected, quantity: pmQuantity } = getGrupalItemData(
    todasPM,
    filterValue,
    uniqueValues,
  )

  return (
    <Filter
      title="Materias"
      maxTags={4}
      icon={<Book strokeWidth={1.4} className="w-[14px] lg:w-[15px]" />}
      filterTags={filterTags}
      removeFilter={removeFilter}
    >
      <div className="text-xs lg:text-sm">
        {MATERIAS_ITEMS_DATA.map(
          ({ anio, todas, materiasTICs, materiasPM }) => {
            const specificAnioValues = filterValue.filter(
              (value) => value.split('(')?.[1]?.[0] === anio[0],
            )

            const { isSelected: todasIsSelected, quantity: todasQuantity } =
              getGrupalItemData(todas, specificAnioValues, uniqueValues)
            const { isSelected: ticsIsSelected, quantity: ticsQuantity } =
              getGrupalItemData(materiasTICs, specificAnioValues, uniqueValues)
            const { isSelected: pmIsSelected, quantity: pmQuantity } =
              getGrupalItemData(materiasPM, specificAnioValues, uniqueValues)

            return (
              <DropdownMenuSub key={anio}>
                <DropdownMenuSubTrigger className="">
                  {anio}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent
                  alignOffset={-5}
                  sideOffset={6}
                  className="text-[length:inherit]"
                >
                  <ScrollArea className="pr-1">
                    <div className="max-h-[max(90vh,calc(var(--radix-dropdown-menu-content-available-height)-20px))]">
                      {todas.map((materia) => (
                        <DropdownMenuCheckboxItem
                          key={materia}
                          disabled={!uniqueValues || !uniqueValues.get(materia)}
                          checked={filterValue.includes(materia)}
                          className="w-full max-w-[calc(var(--radix-dropdown-menu-content-available-width)-20px)] cursor-pointer"
                        >
                          <MenuItem
                            value={materia}
                            quantity={
                              uniqueValues && (uniqueValues.get(materia) ?? 0)
                            }
                            pathname="/analisis-academico"
                            query={{
                              ...searchParams,
                              materias: updateArrParamState(
                                materia,
                                filterValue,
                              ),
                            }}
                          />
                        </DropdownMenuCheckboxItem>
                      ))}

                      {materiasTICs.length > 0 && materiasPM.length > 0 && (
                        <>
                          <DropdownMenuSeparator className="mx-1 bg-muted-foreground/15" />
                          <DropdownMenuLabel className="max-w-[var(--radix-dropdown-menu-trigger-width)] py-1 pl-3 font-medium text-foreground/80">
                            Orientación
                          </DropdownMenuLabel>
                          <DropdownMenuRadioGroup
                            value={
                              (!todasIsSelected &&
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
                                pathname="/analisis-academico"
                                query={{
                                  ...searchParams,
                                  materias: updateArrParamState(
                                    materiasTICs,
                                    filterValue,
                                    specificAnioValues,
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
                                pathname="/analisis-academico"
                                query={{
                                  ...searchParams,
                                  materias: updateArrParamState(
                                    materiasPM,
                                    filterValue,
                                    specificAnioValues,
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
                        disabled={todasQuantity === 0 && !todasIsSelected}
                        checked={todasIsSelected}
                      >
                        <MenuItem
                          value={`Todos las materias de ${anio}`}
                          quantity={todasQuantity}
                          pathname="/analisis-academico"
                          query={{
                            ...searchParams,
                            materias: updateArrParamState(
                              todas,
                              filterValue,
                              specificAnioValues,
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
              pathname="/analisis-academico"
              query={{
                ...searchParams,
                materias: updateArrParamState(todasCB, filterValue),
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
              pathname="/analisis-academico"
              query={{
                ...searchParams,
                materias: updateArrParamState(todasTICS, filterValue),
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
              pathname="/analisis-academico"
              query={{
                ...searchParams,
                materias: updateArrParamState(todasPM, filterValue),
              }}
            />
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator className="mx-1" />
        <DropdownMenuItem
          className="w-full"
          disabled={filterValue.length === 0}
        >
          <Link
            href={{
              pathname: '/analisis-academico',
              query: {
                ...searchParams,
                inclusionEstricta: updateArrParamState(
                  'true',
                  strictInclusionValue ? [strictInclusionValue] : [],
                ),
              },
            }}
            className="flex w-full items-center justify-between gap-4 p-1 lg:gap-6"
          >
            <Label
              htmlFor="estrict-inclusion"
              className="cursor-pointer text-[length:inherit] font-normal text-foreground"
            >
              Inclusión estricta
            </Label>
            <Switch
              id="estrict-inclusion"
              className="h-4 w-8"
              checked={strictInclusionValue === 'true'}
            />
          </Link>
        </DropdownMenuItem>
      </div>
    </Filter>
  )
}

export default MateriasFilter
