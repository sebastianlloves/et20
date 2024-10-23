'use client'

import useParamsState from '@/hooks/useParamsState'
import Filter from './filter'
import { Book } from 'lucide-react'
import { MATERIAS_POR_CURSO } from '@/lib/constants'
import {
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import MenuItem from './menu-item'
import { ScrollArea } from '@/components/ui/scroll-area'

function MateriasFilter({
  materiasUniqueValues,
}: {
  materiasUniqueValues?: Map<string, number>
}) {
  const { pathname, searchParams, replace } = useParamsState()
  const materiasValue = searchParams.get('materias')?.split('_') || []
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

  const updateParams = (materia: string) => {
    const newMateriasState = materiasValue.includes(materia)
      ? materiasValue.filter((prevValue) => prevValue !== materia)
      : [...materiasValue, materia]
    newMateriasState.length
      ? searchParams.set('materias', newMateriasState.join('_'))
      : searchParams.delete('materias')
    replace(`${pathname}?${searchParams.toString()}`)
  }

  const updateStrictInclusion = () => {
    strictInclusion === 'true'
      ? searchParams.delete('inclusionEstricta')
      : searchParams.set('inclusionEstricta', 'true')
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
    replace(`${pathname}?${searchParams}`)
  }

  const handleRemoveAll = () => {
    searchParams.delete('materias')
    if (strictInclusion === 'true') searchParams.delete('inclusionEstricta')
    replace(`${pathname}?${searchParams}`)
  }

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
        {Object.keys(MATERIAS_POR_CURSO).map((anio) => (
          <DropdownMenuSub key={anio}>
            <DropdownMenuSubTrigger className="w-28 sm:w-full">
              {anio}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent
                alignOffset={-5}
                sideOffset={6}
                className="text-[length:inherit]"
              >
                <ScrollArea className="pr-1">
                  <div className="max-h-[max(90vh,calc(var(--radix-dropdown-menu-content-available-height)-20px))]">
                    {MATERIAS_POR_CURSO[
                      anio as keyof typeof MATERIAS_POR_CURSO
                    ].map(({ nombre: materia }) => (
                      <DropdownMenuCheckboxItem
                        key={materia}
                        disabled={
                          !materiasUniqueValues ||
                          !materiasUniqueValues.get(
                            `${materia} (${anio.split(' ')[0]})`,
                          )
                        }
                        checked={materiasValue.includes(
                          `${materia} (${anio.split(' ')[0]})`,
                        )}
                        onSelect={(e) => e.preventDefault()}
                        className="w-full max-w-[calc(var(--radix-dropdown-menu-content-available-width)-20px)] cursor-pointer"
                        onCheckedChange={() =>
                          updateParams(`${materia} (${anio.split(' ')[0]})`)
                        }
                      >
                        <MenuItem
                          value={`${materia} (${anio.split(' ')[0]})`}
                          quantity={
                            materiasUniqueValues &&
                            (materiasUniqueValues.get(
                              `${materia} (${anio.split(' ')[0]})`,
                            ) ??
                              0)
                          }
                        />
                      </DropdownMenuCheckboxItem>
                    ))}
                  </div>
                </ScrollArea>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        ))}
        <DropdownMenuSeparator className="mx-1" />
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          /* disabled={
            materiasValue.length > 0 
          } */
          className="w-28 sm:w-full"
        >
          <div className="flex items-center gap-4 p-1 lg:gap-6">
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
