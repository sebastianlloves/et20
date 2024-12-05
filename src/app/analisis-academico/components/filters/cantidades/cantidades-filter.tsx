import 'server-only'
import {
  getCantFilterData,
  getUniqueValuesModel,
} from '@/app/analisis-academico/utils/dataOperations'
import { FiltersValues } from '@/app/analisis-academico/utils/definitions'
import FilterInput from '../filter-input'
import { Calculator } from 'lucide-react'
import SliderItem from '../slider-item'
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import CantidadesTags from './cantidades-tags'

function CantidadesFilter({
  allFiltersValues = {},
  uniqueValuesModel,
}: {
  allFiltersValues: FiltersValues
  uniqueValuesModel?: ReturnType<typeof getUniqueValuesModel>
}) {
  const troncalesUniqueValues = uniqueValuesModel?.cantidadesTroncales
  const { cantMinMax: troncalesMinMax, filterValue: troncalesFilterValue } =
    getCantFilterData(
      troncalesUniqueValues,
      allFiltersValues.cantidadesTroncales,
    )

  const generalesUniqueValues = uniqueValuesModel?.cantidadesGenerales
  const { cantMinMax: generalesMinMax, filterValue: generalesFilterValue } =
    getCantFilterData(
      generalesUniqueValues,
      allFiltersValues.cantidadesGenerales,
    )

  const enProcesoUniqueValues = uniqueValuesModel?.cantidadesEnProceso2020
  const { cantMinMax: enProcesoMinMax, filterValue: enProcesoFilterValue } =
    getCantFilterData(
      enProcesoUniqueValues,
      allFiltersValues.cantidadesEnProceso2020,
    )

  return (
    <div className="w-full rounded-md border">
      <FilterInput
        title="Cantidades"
        icon={
          <Calculator strokeWidth={1.2} className="w-[15.5px] lg:w-[17px]" />
        }
        content={
          <div>
            <SliderItem
              title="Troncales"
              minMaxValues={troncalesMinMax}
              filterValue={troncalesFilterValue}
              keyParam="cantidadesTroncales"
            />
            <DropdownMenuSeparator className="mx-1" />
            <SliderItem
              title="Generales"
              minMaxValues={generalesMinMax}
              filterValue={generalesFilterValue}
              keyParam="cantidadesGenerales"
            />
            <DropdownMenuSeparator className="mx-1" />
            <SliderItem
              title="En Proceso (2020)"
              minMaxValues={enProcesoMinMax}
              filterValue={enProcesoFilterValue}
              keyParam="cantidadesEnProceso2020"
            />
          </div>
        }
      />
      {(troncalesFilterValue ||
        generalesFilterValue ||
        enProcesoFilterValue) && (
        <CantidadesTags
          allFiltersValues={allFiltersValues}
          uniqueValuesModel={uniqueValuesModel}
        />
      )}
    </div>
  )
}

export default CantidadesFilter
