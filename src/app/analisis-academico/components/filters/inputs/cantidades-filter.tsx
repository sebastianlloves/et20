import {
  FILTERS_FNS,
  // getStudentsUniqueValues,
} from '@/app/analisis-academico/utils/dataOperations'
// import { getQuantity } from '@/app/analisis-academico/utils/urlParamsOperations'
import Filter from './filter'
import { Calculator } from 'lucide-react'
import SliderItem from '../slider-item'
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { formatCantValuesParam } from '@/app/analisis-academico/utils/urlParamsOperations'
import { TableFilterProps } from '@/app/analisis-academico/utils/definitions'

function CantidadesFilter({ searchParams, data }: TableFilterProps) {
  /* const uniqueValues =
    data && getStudentsUniqueValues(data, searchParams, 'cantidades', true) */
  const minMaxValues = data && FILTERS_FNS.cantidades.getMinMaxCant(data)
  const cantTroncalesValue = formatCantValuesParam(
    searchParams.cantidadesTroncales,
    minMaxValues?.troncalesMinMax,
  )
  const cantGeneralesValue = formatCantValuesParam(
    searchParams.cantidadesGenerales,
    minMaxValues?.generalesMinMax,
  )
  const cantEnProceso2020Value = formatCantValuesParam(
    searchParams.cantidadesEnProceso2020,
    minMaxValues?.enProceso2020MinMax,
  )
  const showEnProceso2020 = searchParams.enProceso2020 !== 'false'

  const troncalesTag = cantTroncalesValue && {
    value: cantTroncalesValue.join('_'),
    tagText: getCantMateriasString(cantTroncalesValue, {
      plural: 'troncales',
      singular: 'troncal',
    }),
    quantity: null,
    newQueryState: JSON.stringify({
      ...searchParams,
      cantidadesTroncales: undefined,
    }),
  }
  const generalesTag = cantGeneralesValue && {
    value: cantGeneralesValue.join('_'),
    tagText: getCantMateriasString(cantGeneralesValue, {
      plural: 'generales',
      singular: 'general',
    }),
    quantity: null,
    newQueryState: JSON.stringify({
      ...searchParams,
      cantidadesGenerales: undefined,
    }),
  }
  const enProceso2020Tag = cantEnProceso2020Value && {
    value: cantEnProceso2020Value.join('_'),
    tagText: getCantMateriasString(cantEnProceso2020Value, {
      plural: 'en Proceso (2020)',
      singular: 'en Proceso (2020)',
    }),
    quantity: null,
    newQueryState: JSON.stringify({
      ...searchParams,
      cantidadesEnProceso2020: undefined,
    }),
  }
  const filterTags = [
    troncalesTag,
    generalesTag,
    showEnProceso2020 ? enProceso2020Tag : undefined,
  ].filter((tag) => tag !== undefined)

  return (
    <Filter
      title="Cantidades"
      maxTags={3}
      icon={<Calculator strokeWidth={1.2} className="w-[15.5px] lg:w-[17px]" />}
      filterTags={filterTags}
      paramKeys={[
        'cantidadesTroncales',
        'cantidadesGenerales',
        'cantidadesEnProceso2020',
      ]}
    >
      <SliderItem
        title="Troncales"
        min={minMaxValues?.troncalesMinMax[0] || 0}
        max={minMaxValues?.troncalesMinMax[1] || 0}
        paramKey="cantidadesTroncales"
        filterValue={cantTroncalesValue}
      />

      <DropdownMenuSeparator className="mx-1" />

      <SliderItem
        title="Generales"
        min={minMaxValues?.generalesMinMax[0] || 0}
        max={minMaxValues?.generalesMinMax[1] || 0}
        paramKey="cantidadesGenerales"
        filterValue={cantGeneralesValue}
      />
      {showEnProceso2020 && (
        <>
          <DropdownMenuSeparator className="mx-1" />

          <SliderItem
            title="En Proceso (2020)"
            min={minMaxValues?.enProceso2020MinMax[0] || 0}
            max={minMaxValues?.enProceso2020MinMax[1] || 0}
            paramKey="cantidadesEnProceso2020"
            filterValue={cantEnProceso2020Value}
          />
        </>
      )}
    </Filter>
  )
}

export default CantidadesFilter

const getCantMateriasString = (
  [min, max]: number[],
  materiaType: { singular: string; plural: string },
) => {
  if (min === 0) {
    if (max === 0) return `No adeuda materias ${materiaType.plural}`
    return `Hasta ${max} materia${max > 1 ? 's' : ''} ${max > 1 ? materiaType.plural : materiaType.singular}`
  }
  if (min === max)
    return `${max} materia${max > 1 ? 's' : ''} ${max > 1 ? materiaType.plural : materiaType.singular}`
  return `Entre ${min} y ${max} materia${max > 1 ? 's' : ''} ${max > 1 ? materiaType.plural : materiaType.singular}`
}
