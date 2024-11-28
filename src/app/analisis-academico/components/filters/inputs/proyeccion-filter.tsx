import {
  FILTERS_FNS,
  getQuantity,
  getStudentsUniqueValues,
} from '@/app/analisis-academico/utils/dataOperations'
import Filter from './filter'
import { FastForward } from 'lucide-react'
import { updateArrParamState } from '@/app/analisis-academico/utils/urlParamsOperations'
import { PROYECCION_DATA } from '@/app/analisis-academico/utils/constants'
import {
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import MenuItem from '../menu-item'
import { TableFilterProps } from '@/app/analisis-academico/utils/definitions'

function ProyeccionFilter({ searchParams, data }: TableFilterProps) {
  const uniqueValues =
    data && getStudentsUniqueValues(data, searchParams, 'proyeccion')
  const califParcialFilter = searchParams.califParciales
  const filterValue = FILTERS_FNS.proyeccion.formatParam(
    searchParams.proyeccion,
  )
  const filterTags = filterValue.map((value) => {
    const tagText = value
    const quantity = getQuantity(value, uniqueValues)
    const newQueryState = JSON.stringify({
      ...searchParams,
      proyeccion: updateArrParamState(value, filterValue),
    })
    return { value, tagText, quantity, newQueryState }
  })

  return (
    <Filter
      title="Proyección"
      maxTags={3}
      icon={<FastForward strokeWidth={1.8} className="w-[13px] lg:w-[15px]" />}
      filterTags={filterTags}
      paramKeys={['proyeccion']}
    >
      {PROYECCION_DATA.filter(
        ({ show }) => !show || show(califParcialFilter),
      ).map(({ value }) => {
        const quantity = getQuantity(value, uniqueValues)
        return (
          <div key={value}>
            {value === 'Faltan datos' && (
              <DropdownMenuSeparator className="mx-1 bg-muted-foreground/15" />
            )}
            <DropdownMenuCheckboxItem
              className="cursor-pointer sm:w-full"
              disabled={quantity === 0}
              checked={filterValue.includes(value)}
            >
              <MenuItem
                value={value}
                quantity={quantity}
                newQueryState={JSON.stringify({
                  ...searchParams,
                  proyeccion: updateArrParamState(value, filterValue),
                })}
                paramKeys={['proyeccion']}
              />
            </DropdownMenuCheckboxItem>
          </div>
        )
      })}
    </Filter>
  )
}

export default ProyeccionFilter
