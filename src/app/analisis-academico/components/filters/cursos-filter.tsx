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

function CursosFilter({ uniqueValues }: { uniqueValues?: Map<string, number> }) {
  const { pathname, searchParams, replace } = useParamsState()
  const filterValue = searchParams.get('cursos')?.split('_') || []
  console.log('CursosFilter')

  const updateParams = (curso: string) => {
    const newCursosState = filterValue.includes(curso)
      ? filterValue.filter((prevParam) => prevParam !== curso)
      : [...filterValue, curso]
    console.log('updateParams')
    newCursosState.length === 0
      ? searchParams.delete('cursos')
      : searchParams.set('cursos', newCursosState.join('_'))
    replace(`${pathname}?${searchParams.toString()}`)
  }

  const handleRemoveAll = () => {
    searchParams.delete('cursos')
    replace(`${pathname}?${searchParams}`)
  }

  const handleRemoveTag = (value: string) => {
    const newState = filterValue.filter((prevValue) => prevValue !== value)
    newState.length
      ? searchParams.set('cursos', newState.join('_'))
      : searchParams.delete('cursos')
    replace(`${pathname}?${searchParams}`)
  }

  return (
    <Filter
      title="Cursos"
      maxTags={4}
      icon={<Users size={15} strokeWidth={1.4} />}
      filterTags={filterValue.sort()}
      uniqueValues={uniqueValues}
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
                  className="cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                  checked={filterValue.includes(curso)}
                  onCheckedChange={() => updateParams(curso)}
                >
                  <MenuItem value={curso} quantity={uniqueValues?.get(curso) ?? 0} />
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
