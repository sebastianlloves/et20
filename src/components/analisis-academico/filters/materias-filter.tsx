'use client'

import useParamsState from '@/hooks/useParamsState'
import Filter from './filter'
import { Book } from 'lucide-react'
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
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import MenuItem from './menu-item'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MATERIAS_ITEMS_DATA } from '@/app/analisis-academico/utils/constants'
import { FILTERS_FNS } from '@/app/analisis-academico/utils/dataOperations'
import { getGrupalItemData } from '@/app/analisis-academico/utils/urlParamsOperations'

function MateriasFilter({
  materiasUniqueValues,
}: {
  materiasUniqueValues?: Map<string, number>
}) {
  const { pathname, searchParams, replace } = useParamsState()
  const materiasValue = FILTERS_FNS.materias.formatParam(
    searchParams.get('materias'),
  )
  const strictInclusion = searchParams.get('inclusionEstricta')
  const materiasTags = materiasValue.map((value) => {
    const quantity =
      materiasUniqueValues && (materiasUniqueValues.get(value) ?? 0)
    return { value, quantity }
  })
  const filterTags =
    strictInclusion === 'true'
      ? [
          {
            value: 'Inclusión estricta',
            quantity: null,
            className: 'rounded-lg pl-1 bg-primary/15',
          },
          ...materiasTags,
        ]
      : materiasTags

  const updateParams = (itemValue: string | string[]) => {
    let newState: string[]
    if (typeof itemValue === 'string') {
      newState = materiasValue.includes(itemValue)
        ? materiasValue.filter((prevValue) => prevValue !== itemValue)
        : [...materiasValue, itemValue]
    } else {
      const distintosAnios = [
        ...new Set(itemValue.map((materia) => materia.split('(')[1][0])),
      ]
      const analyzedValues =
        distintosAnios.length > 1
          ? materiasValue
          : materiasValue.filter(
              (materia) => materia.split('(')[1][0] === distintosAnios[0],
            )
      const areEqualsArrays =
        JSON.stringify(itemValue.sort(FILTERS_FNS.materias.sortParam)) ===
        JSON.stringify(analyzedValues.sort(FILTERS_FNS.materias.sortParam))
      newState = areEqualsArrays
        ? materiasValue.filter((value) => !itemValue.includes(value))
        : [
            ...new Set([
              ...materiasValue.filter(
                (value) => !analyzedValues.includes(value),
              ),
              ...itemValue,
            ]),
          ]
    }
    newState.length
      ? searchParams.set(
          'materias',
          newState.sort(FILTERS_FNS.materias.sortParam).join('_'),
        )
      : searchParams.delete('materias')
    if (searchParams.has('page')) searchParams.delete('page')
    replace(`${pathname}?${searchParams.toString()}`)
  }

  const updateStrictInclusion = () => {
    strictInclusion === 'true'
      ? searchParams.delete('inclusionEstricta')
      : searchParams.set('inclusionEstricta', 'true')
    if (searchParams.has('page')) searchParams.delete('page')
    replace(`${pathname}?${searchParams.toString()}`)
  }

  const handleRemoveTag = (value: string) => {
    if (value === 'Inclusión estricta') {
      searchParams.delete('inclusionEstricta')
    } else {
      const newState = materiasValue.filter((prevValue) => prevValue !== value)
      newState.length
        ? searchParams.set('materias', newState.join('_'))
        : searchParams.delete('materias')
    }
    if (searchParams.has('page')) searchParams.delete('page')
    replace(`${pathname}?${searchParams}`)
  }

  const handleRemoveAll = () => {
    searchParams.delete('materias')
    if (strictInclusion === 'true') searchParams.delete('inclusionEstricta')
    if (searchParams.has('page')) searchParams.delete('page')
    replace(`${pathname}?${searchParams}`)
  }

  const todasCB = MATERIAS_ITEMS_DATA.flatMap(({ materiasCB }) => materiasCB)
  const { isSelected: cbIsSelected, quantity: cbQuantity } = getGrupalItemData(
    todasCB,
    materiasValue,
    materiasUniqueValues,
  )
  const todasTICS = MATERIAS_ITEMS_DATA.flatMap(
    ({ materiasTICs }) => materiasTICs,
  )
  const { isSelected: ticsIsSelected, quantity: ticsQuantity } =
    getGrupalItemData(todasTICS, materiasValue, materiasUniqueValues)

  const todasPM = MATERIAS_ITEMS_DATA.flatMap(({ materiasPM }) => materiasPM)
  const { isSelected: pmIsSelected, quantity: pmQuantity } = getGrupalItemData(
    todasPM,
    materiasValue,
    materiasUniqueValues,
  )

  return (
    <Filter
      title="Materias"
      maxTags={3}
      icon={<Book strokeWidth={1.4} className="w-[14px] lg:w-[15px]" />}
      filterTags={filterTags}
      handleRemoveTag={handleRemoveTag}
      handleRemoveAll={handleRemoveAll}
    >
      <div className="text-xs lg:text-sm">
        {MATERIAS_ITEMS_DATA.map(
          ({
            anio,
            todas /* , troncales, generales */,
            materiasTICs,
            materiasPM,
          }) => {
            const especificAnioValues = materiasValue.filter(
              (value) => value.split('(')?.[1]?.[0] === anio[0],
            )

            const { isSelected: todasIsSelected, quantity: todasQuantity } =
              getGrupalItemData(
                todas,
                especificAnioValues,
                materiasUniqueValues,
              )
            const { isSelected: ticsIsSelected, quantity: ticsQuantity } =
              getGrupalItemData(
                materiasTICs,
                especificAnioValues,
                materiasUniqueValues,
              )
            const { isSelected: pmIsSelected, quantity: pmQuantity } =
              getGrupalItemData(
                materiasPM,
                especificAnioValues,
                materiasUniqueValues,
              )

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
                          disabled={
                            !materiasUniqueValues ||
                            !materiasUniqueValues.get(materia)
                          }
                          checked={materiasValue.includes(materia)}
                          onSelect={(e) => e.preventDefault()}
                          className="w-full max-w-[calc(var(--radix-dropdown-menu-content-available-width)-20px)] cursor-pointer"
                          onCheckedChange={() => updateParams(materia)}
                        >
                          <MenuItem
                            value={materia}
                            quantity={
                              materiasUniqueValues &&
                              (materiasUniqueValues.get(materia) ?? 0)
                            }
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
                            onValueChange={(value) => {
                              if (value === 'TICs') updateParams(materiasTICs)
                              if (value === 'Prod. Multimedial')
                                updateParams(materiasPM)
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
                        disabled={todasQuantity === 0 && !todasIsSelected}
                        checked={todasIsSelected}
                        onCheckedChange={() => updateParams(todas)}
                      >
                        <MenuItem
                          value={`Todos las materias de ${anio}`}
                          quantity={todasQuantity}
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
          onValueChange={(value) => {
            if (value === 'CB') updateParams(todasCB)
            if (value === 'TICs') updateParams(todasTICS)
            if (value === 'Prod. Multimedial') updateParams(todasPM)
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

        <DropdownMenuSeparator className="mx-1" />
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          /* disabled={
            materiasValue.length > 0 
          } */
          className="w-full"
        >
          <div className="flex w-full items-center justify-between gap-4 p-1 lg:gap-6">
            <Label
              htmlFor="estrict-inclusion"
              className="cursor-pointer text-[length:inherit] font-normal text-foreground"
            >
              Inclusión estricta
            </Label>
            <Switch
              id="estrict-inclusion"
              className="h-4 w-8"
              onSelect={(e) => e.preventDefault()}
              checked={strictInclusion === 'true'}
              onCheckedChange={updateStrictInclusion}
            />
          </div>
        </DropdownMenuItem>
      </div>
    </Filter>
  )
}

export default MateriasFilter
