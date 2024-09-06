'use client'

import useParamsState from '@/hooks/useParamsState'
import Filter from './filter'
import { CursosFilterContent } from './filters-content'
import { Users } from 'lucide-react'

function CursosFilter() {
  const { pathname, searchParams, replace } = useParamsState()
  const filterValue = searchParams.get('cursos')?.split(',') || []
  console.log('CursosFilter')

  const updateParams = (curso: string) => {
    const newCursosState = filterValue.includes(curso)
      ? filterValue.filter((prevParam) => prevParam !== curso)
      : [...filterValue, curso]
    console.log('updateParams')
    newCursosState.length === 0
      ? searchParams.delete('cursos')
      : searchParams.set('cursos', newCursosState.join(','))
    replace(`${pathname}?${searchParams.toString()}`)
  }

  const handleRemoveAll = () => {
    searchParams.delete('cursos')
    replace(`${pathname}?${searchParams}`)
  }

  const handleRemoveTag = (value: string) => {
    const newState = filterValue.filter((prevValue) => prevValue !== value)
    newState.length
      ? searchParams.set('cursos', newState.join(','))
      : searchParams.delete('cursos')
    replace(`${pathname}?${searchParams}`)
  }

  return (
    <Filter
      title="Cursos"
      icon={<Users size={15} strokeWidth={1.4} />}
      filterTags={filterValue.sort()}
      handleRemoveTag={handleRemoveTag}
      handleRemoveAll={handleRemoveAll}
    >
      <CursosFilterContent
        filterValue={filterValue}
        updateParams={updateParams}
      />
    </Filter>
  )
}

export default CursosFilter
