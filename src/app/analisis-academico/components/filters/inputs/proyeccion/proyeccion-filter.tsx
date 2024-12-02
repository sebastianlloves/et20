import { FiltersValues } from '@/app/analisis-academico/utils/definitions'
import FilterInput from '../filter-input'
import { FastForward } from 'lucide-react'
import ProyeccionFilterContent from './proyeccion-filter-content'
import { PROYECCION_DATA } from '@/app/analisis-academico/utils/constants'
import { getQuantity } from '@/app/analisis-academico/utils/dataOperations'
import ProyeccionTags from '../../tags/proyeccion-tags'

function ProyeccionFilter({
  allFiltersValues = {},
  uniqueValues,
}: {
  allFiltersValues: FiltersValues
  uniqueValues?: Map<any, number>
}) {
  const filterValue = allFiltersValues.proyeccion || []
  const califParcialFilter = allFiltersValues.califParciales
  /* if (califParcialFilter)
    filterValue = filterValue.filter((value) => value !== 'Egresa') */
  const showedItems = PROYECCION_DATA.filter(
    ({ show }) => !show || show(califParcialFilter),
  )
  const filterItemsData = showedItems.map(({ value }) => {
    const itemText = value
    const quantity = getQuantity(value, uniqueValues)
    const isSelected = filterValue.includes(value)
    return { value, itemText, quantity, isSelected }
  })

  return (
    <div className="w-full rounded-md border">
      <FilterInput
        title="Proyección"
        icon={
          <FastForward strokeWidth={1.8} className="w-[13px] lg:w-[15px]" />
        }
        content={
          <ProyeccionFilterContent
            filterValue={filterValue}
            filterItemsData={filterItemsData}
          />
        }
      />
      <ProyeccionTags filterValue={filterValue} uniqueValues={uniqueValues} />
    </div>
  )
}

export default ProyeccionFilter
