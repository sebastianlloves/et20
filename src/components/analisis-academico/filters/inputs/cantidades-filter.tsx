import {
  FILTERS_FNS,
  getStudentsUniqueValues,
} from '@/app/analisis-academico/utils/dataOperations'
import { TableFilterProps } from './cursos-filter'
import { getQuantity } from '@/app/analisis-academico/utils/urlParamsOperations'
import Filter from '../filter'
import { Calculator } from 'lucide-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import SliderItem from '../slider-item'

function CantidadesFilter({ searchParams, data }: TableFilterProps) {
  const uniqueValues =
    data && getStudentsUniqueValues(data, searchParams, 'cantidades', true)
  const minMaxValues = data && FILTERS_FNS.cantidades.getMinMaxCant(data)
  const cantTroncalesValue = FILTERS_FNS.cantidades.formatParam(
    searchParams.cantidadesTroncales,
  )
  const cantGeneralesValue = FILTERS_FNS.cantidades.formatParam(
    searchParams.cantidadesGenerales,
  )
  const cantEnProceso2020Value = FILTERS_FNS.cantidades.formatParam(
    searchParams.cantidadesEnProceso2020,
  )

  const troncalesTags = cantTroncalesValue && {
    value: cantTroncalesValue.join('_'),
    tagText: getCantMateriasString(cantTroncalesValue, {
      plural: 'troncales',
      singular: 'troncal',
    }),
    quantity: null,
    pathname: '/analisis-academico',
    query: {
      ...searchParams,
      cantidadesTroncales: undefined,
    },
  }
  const generalesTags = cantGeneralesValue && {
    value: cantGeneralesValue.join('_'),
    tagText: getCantMateriasString(cantGeneralesValue, {
      plural: 'generales',
      singular: 'general',
    }),
    quantity: null,
    pathname: '/analisis-academico',
    query: {
      ...searchParams,
      cantidadesGenerales: undefined,
    },
  }
  const enProceso2020Tags = cantEnProceso2020Value && {
    value: cantEnProceso2020Value.join('_'),
    tagText: getCantMateriasString(cantEnProceso2020Value, {
      plural: 'en Proceso (2020)',
      singular: 'en Proceso (2020)',
    }),
    quantity: null,
    pathname: '/analisis-academico',
    query: {
      ...searchParams,
      cantidadesEnProceso2020: undefined,
    },
  }
  const filterTags = [troncalesTags, generalesTags, enProceso2020Tags].filter(
    (tag) => tag !== undefined,
  )
  const removeFilter = {
    pathname: '/analisis-academico',
    query: {
      ...searchParams,
      cantidadesTroncales: undefined,
      cantidadesGenerales: undefined,
      cantidadesEnProceso2020: undefined,
    },
  }

  return (
    <Filter
      title="Cantidades"
      maxTags={3}
      icon={<Calculator strokeWidth={1.2} className="w-[15.5px] lg:w-[17px]" />}
      filterTags={filterTags}
      removeFilter={removeFilter}
    >
      <SliderItem />
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

const getNumbersBetween = (numberArr: number[]) => {
  const min = Math.min(...numberArr)
  const max = Math.max(...numberArr)
  return Array.from({ length: max - min + 1 }, (_, index) => min + index)
}
