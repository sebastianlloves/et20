'use client'

import useParamsState from '@/hooks/useParamsState'
import Filter from './filter'
import { Book } from 'lucide-react'
import { MATERIAS_POR_CURSO } from '@/lib/constants'
import {
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import MenuItem from './menu-item'

function MateriasFilter({
  uniqueValues,
}: {
  uniqueValues?: Map<string, number>
}) {
  const { pathname, searchParams, replace } = useParamsState()
  const filterValue = searchParams.get('materias')?.split('_') || []
  const strictInclusion = searchParams.get('inclusionEstricta')

  const updateParams = (materia: string) => {
    const newMateriasState = filterValue.includes(materia)
      ? filterValue.filter((prevValue) => prevValue !== materia)
      : [...filterValue, materia]
    newMateriasState.length === 0
      ? searchParams.delete('materias')
      : searchParams.set('materias', newMateriasState.join('_'))
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
      const newState = filterValue.filter((prevValue) => prevValue !== value)
      newState.length
        ? searchParams.set('materias', newState.join('_'))
        : searchParams.delete('materias')
    }
    replace(`${pathname}?${searchParams}`)
  }

  const handleRemoveAll = () => {
    searchParams.delete('materias')
    searchParams.delete('inclusionEstricta')
    replace(`${pathname}?${searchParams}`)
  }

  return (
    <Filter
      title="Materias"
      maxTags={4}
      icon={<Book size={15} strokeWidth={1.4} />}
      filterTags={
        strictInclusion === 'true'
          ? ['Inclusión estricta', ...filterValue]
          : filterValue
      }
      uniqueValues={uniqueValues}
      handleRemoveTag={handleRemoveTag}
      handleRemoveAll={handleRemoveAll}
    >
      <>
        {Object.keys(MATERIAS_POR_CURSO).map((anio) => (
          <DropdownMenuSub key={anio}>
            <DropdownMenuSubTrigger>{anio}</DropdownMenuSubTrigger>
            <DropdownMenuSubContent alignOffset={-5} sideOffset={6}>
              {MATERIAS_POR_CURSO[anio as keyof typeof MATERIAS_POR_CURSO].map(
                ({ nombre: materia }) => (
                  <DropdownMenuCheckboxItem
                    key={materia}
                    checked={filterValue?.includes(
                      `${materia} (${anio.split(' ')[0]})`,
                    )}
                    onSelect={(e) => {
                      e.preventDefault()
                      updateParams(`${materia} (${anio.split(' ')[0]})`)
                    }}
                    className="cursor-pointer"
                    onChange={() =>
                      updateParams(`${materia} (${anio.split(' ')[0]})`)
                    }
                  >
                    <MenuItem
                      value={`${materia} (${anio.split(' ')[0]})`}
                      quantity={
                        uniqueValues?.get(
                          `${materia} (${anio.split(' ')[0]})`,
                        ) ?? 0
                      }
                    />
                  </DropdownMenuCheckboxItem>
                ),
              )}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
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
