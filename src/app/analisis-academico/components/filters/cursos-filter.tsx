'use client'

import useParamsState from '@/hooks/useParamsState'
import Filter from './filter'
import { CursosFilterContent } from './filters-content'
import { Users } from 'lucide-react'

function CursosFilter({ uniqueValues }: { uniqueValues: Map<string, number> }) {
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
      <CursosFilterContent
        filterValue={filterValue}
        updateParams={updateParams}
        uniqueValues={uniqueValues}
      />
    </Filter>
  )
}

export default CursosFilter
