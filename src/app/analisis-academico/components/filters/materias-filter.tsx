'use client'

import useParamsState from '@/hooks/useParamsState'
import Filter from './filter'
import { MateriasFilterContent } from './filters-content'
import { Book } from 'lucide-react'

function MateriasFilter() {
  const { pathname, searchParams, replace } = useParamsState()
  const filterValue = searchParams.get('materias')?.split(',') || []
  const strictInclusion = searchParams.get('inclusionEstricta')

  const updateParams = (materia: string) => {
    const newMateriasState = filterValue.includes(materia)
      ? filterValue.filter((prevValue) => prevValue !== materia)
      : [...filterValue, materia]
    newMateriasState.length === 0
      ? searchParams.delete('materias')
      : searchParams.set('materias', newMateriasState.join(','))
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
        ? searchParams.set('materias', newState.join(','))
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
      icon={<Book size={15} strokeWidth={1.4} />}
      filterTags={
        strictInclusion === 'true'
          ? ['Inclusión estricta', ...filterValue]
          : filterValue
      }
      handleRemoveTag={handleRemoveTag}
      handleRemoveAll={handleRemoveAll}
    >
      <MateriasFilterContent
        filterValue={filterValue}
        inclusionEstrictaValue={strictInclusion || undefined}
        updateParams={updateParams}
        updateStrictInclusion={updateStrictInclusion}
      />
    </Filter>
  )
}

export default MateriasFilter
