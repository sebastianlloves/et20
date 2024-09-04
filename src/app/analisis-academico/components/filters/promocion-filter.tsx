'use client'

import useParamsState from '@/hooks/useParamsState'
import Filter from './filter'
import { BadgeCheck } from 'lucide-react'
import { PromocionFilterContent } from './filters-content'

const filterValueTag: { [key: string]: string } = {
  'solo promocionan': 'Sólo estudiantes que promocionan',
  'solo permanecen': 'Sólo estudiantes que permanecen',
}

function PromocionFilter() {
  const { pathname, searchParams, replace } = useParamsState()
  const filterValue = searchParams.get('promocion')

  const updateParams = (promocionValue: string) => {
    filterValue === promocionValue
      ? searchParams.delete('promocion')
      : searchParams.set('promocion', promocionValue)
    replace(`${pathname}?${searchParams.toString()}`)
  }

  const handleRemoveAll = () => {
    searchParams.delete('promocion')
    replace(`${pathname}?${searchParams}`)
  }

  const handleRemoveTag = handleRemoveAll

  return (
    <Filter
      title="Promoción"
      icon={<BadgeCheck size={18} strokeWidth={1.0} />}
      filterTags={filterValue ? [filterValueTag[filterValue]] : []}
      handleRemoveTag={handleRemoveTag}
      handleRemoveAll={handleRemoveAll}
    >
      <PromocionFilterContent filterValue={filterValue || undefined} updateParams={updateParams} />
    </Filter>
  )
}

export default PromocionFilter
