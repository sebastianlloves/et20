'use client'

import useParamsState from '@/hooks/useParamsState'
import Filter from './filter'
import { Users } from 'lucide-react'
import { CURSOS_POR_ANIO } from '@/lib/constants'
import {
  DropdownMenuCheckboxItem,
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

  const updateParams = (curso: string) => {
    const newCursosState = cursosValue.includes(curso)
      ? cursosValue.filter((prevParam) => prevParam !== curso)
      : [...cursosValue, curso]
    newCursosState.length
      ? searchParams.set('cursos', newCursosState.join('_'))
      : searchParams.delete('cursos')
    replace(`${pathname}?${searchParams.toString()}`)
  }

  const handleRemoveAll = () => {
    searchParams.delete('cursos')
    replace(`${pathname}?${searchParams}`)
  }

  const handleRemoveTag = (value: string) => {
    const newState = cursosValue.filter((prevValue) => prevValue !== value)
    newState.length
      ? searchParams.set('cursos', newState.join('_'))
      : searchParams.delete('cursos')
    replace(`${pathname}?${searchParams}`)
  }

  return (
    <Filter
      title="Cursos"
      maxTags={3}
      icon={<Users size={15} strokeWidth={1.4} />}
      filterTags={cursosTags}
      handleRemoveTag={handleRemoveTag}
      handleRemoveAll={handleRemoveAll}
    >
      <>
        {Object.keys(CURSOS_POR_ANIO).map((anio) => (
          <DropdownMenuSub key={anio}>
            <DropdownMenuSubTrigger className="pl-3">
              {anio}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent alignOffset={-5} sideOffset={6}>
              {CURSOS_POR_ANIO[anio].map((curso) => (
                <DropdownMenuCheckboxItem
                  key={curso}
                  disabled={!uniqueValues || !uniqueValues.get(curso)}
                  className="cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                  checked={cursosValue.includes(curso)}
                  onCheckedChange={() => updateParams(curso)}
                >
                  <MenuItem
                    value={curso}
                    quantity={uniqueValues && (uniqueValues.get(curso) ?? 0)}
                  />
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ))}
      </>
    </Filter>
  )
}

export default CursosFilter
