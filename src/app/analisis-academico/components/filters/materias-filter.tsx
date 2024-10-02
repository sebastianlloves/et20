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
      icon={<Book size={15} strokeWidth={1.4} />}
      filterTags={filterTags}
      handleRemoveTag={handleRemoveTag}
      handleRemoveAll={handleRemoveAll}
    >
      <>
        {Object.keys(MATERIAS_POR_CURSO).map((anio) => (
          <DropdownMenuSub key={anio}>
            <DropdownMenuSubTrigger className="w-36 sm:w-full">
              {anio}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent
                collisionPadding={20}
                alignOffset={-5}
                sideOffset={6}
              >
                <ScrollArea className="pr-1">
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
                      className="w-52 cursor-pointer sm:w-64 lg:w-full"
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
                </ScrollArea>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          /* disabled={
            materiasValue.length > 0 
          } */
          className="w-36 sm:w-full"
        >
          <div className="flex items-center space-x-6 p-1">
            <Label
              htmlFor="estrict-inclusion"
              className="cursor-pointer font-normal text-foreground"
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
      </>
    </Filter>
  )
}

export default MateriasFilter
