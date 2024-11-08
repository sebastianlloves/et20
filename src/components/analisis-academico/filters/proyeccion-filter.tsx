'use client'

import { FastForward } from 'lucide-react'
import Filter from './filter'
import { DropdownMenuCheckboxItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import MenuItem from './menu-item'
import useParamsState from '@/hooks/useParamsState'

const proyeccionFilterData = [
  { value: 'Promociona' },
  { value: 'Permanece' },
  {
    value: 'Egresa',
    show: (califParcialesFilter: string | null) => !califParcialesFilter,
  },
  {
    value: 'Egresa (titula)',
    show: (califParcialesFilter: string | null) =>
      Boolean(califParcialesFilter),
  },
  {
    value: 'Egresa (NO titula)',
    show: (califParcialesFilter: string | null) =>
      Boolean(califParcialesFilter),
  },
  { value: 'Faltan datos' },
]

function ProyeccionFilter({
  uniqueValues,
}: {
  uniqueValues?: Map<string, number>
}) {
  const { pathname, searchParams, replace } = useParamsState()
  const califParcialFilter = searchParams.get('califParciales')
  const proyeccionFilter =
    searchParams
      .get('proyeccion')
      ?.split('_')
      .filter((valueItem) =>
        proyeccionFilterData.find(({ value }) => value === valueItem),
      ) || []
  const proyeccionTags = proyeccionFilter.map((string) => {
    return {
      value: string,
      quantity: uniqueValues && (uniqueValues.get(string) ?? 0),
    }
  })

  const updateProyeccionParam = (value: string) => {
    const debuggedFilterValue = proyeccionFilter.filter((valueItem) => {
      const filterData = proyeccionFilterData.find(
        ({ value }) => value === valueItem,
      )
      return !filterData?.show || filterData.show(califParcialFilter)
    })
    const newFilterValue = debuggedFilterValue.includes(value)
      ? debuggedFilterValue.filter((filterValue) => filterValue !== value)
      : [...debuggedFilterValue, value]
    newFilterValue.length
      ? searchParams.set('proyeccion', newFilterValue.join('_'))
      : searchParams.delete('proyeccion')

    replace(`${pathname}?${searchParams}`)
  }

  const handleRemoveAll = () => {
    searchParams.delete('proyeccion')
    replace(`${pathname}?${searchParams}`)
  }
  const handleRemoveTag = (tagValue: string) => {
    const newFilterValue = proyeccionFilter.filter(
      (value) => value !== tagValue,
    )
    newFilterValue.length
      ? searchParams.set('proyeccion', newFilterValue.join('_'))
      : searchParams.delete('proyeccion')
    replace(`${pathname}?${searchParams}`)
  }

  return (
    <Filter
      title="Proyección"
      maxTags={3}
      icon={<FastForward strokeWidth={1.5} className="w-[13px] lg:w-[15px]" />}
      filterTags={proyeccionTags}
      handleRemoveTag={handleRemoveTag}
      handleRemoveAll={handleRemoveAll}
    >
      {proyeccionFilterData
        .filter(({ show }) => !show || show(califParcialFilter))
        .map(({ value }) => {
          const quantity = uniqueValues && (uniqueValues.get(value) ?? 0)
          return (
            <div key={value}>
              {value === 'Faltan datos' && (
                <DropdownMenuSeparator className="mx-1 bg-muted-foreground/15" />
              )}
              <DropdownMenuCheckboxItem
                className="cursor-pointer sm:w-full"
                disabled={quantity === 0}
                checked={proyeccionFilter.includes(value)}
                onCheckedChange={() => updateProyeccionParam(value)}
              >
                <MenuItem value={value} quantity={quantity} />
              </DropdownMenuCheckboxItem>
            </div>
          )
        })}
    </Filter>
  )
}

export default ProyeccionFilter
