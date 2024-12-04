import 'server-only'

import { FiltersValues } from '@/app/analisis-academico/utils/definitions'
import {
  AGENDA_ANIO_ACTUAL,
  ANIO_ACTUAL,
  CARACTER_GRADO,
} from '@/lib/constants'
import { StudentCalifActuales } from '@/lib/definitions'
import FilterInput from '../filter-input'
import { ChartCandlestick } from 'lucide-react'
import CalifParcialesFilterContent from './calif-parciales-filter-content'
import CalifParcialesTags from './calif-parciales-tags'

export const PERIODOS: {
  itemText: string
  tagText: string
  value: keyof StudentCalifActuales['materias'][number] | 'acreditacion'
}[] = [
  {
    itemText: `1${CARACTER_GRADO} Bimestre`,
    value: 'primerBimestre',
    tagText: `Incluir calificaciones del 1${CARACTER_GRADO} Bimestre`,
  },
  {
    itemText: `2${CARACTER_GRADO} Bimestre`,
    value: 'segundoBimestre',
    tagText: `Incluir calificaciones del 2${CARACTER_GRADO} Bimestre`,
  },
  {
    itemText: `3${CARACTER_GRADO} Bimestre`,
    value: 'tercerBimestre',
    tagText: `Incluir calificaciones del 3${CARACTER_GRADO} Bimestre`,
  },
  {
    itemText: `4${CARACTER_GRADO} Bimestre`,
    value: 'cuartoBimestre',
    tagText: `Incluir calificaciones del 4${CARACTER_GRADO} Bimestre`,
  },
  {
    itemText: `1${CARACTER_GRADO} Cuatrimestre`,
    value: 'primerCuatrimestre',
    tagText: `Incluir calificaciones del 1${CARACTER_GRADO} Cuatrimestre`,
  },
  {
    itemText: `2${CARACTER_GRADO} Cuatrimestre`,
    value: 'segundoCuatrimestre',
    tagText: `Incluir calificaciones del 2${CARACTER_GRADO} Cuatrimestre`,
  },
  {
    itemText: `Anual`,
    value: 'anual',
    tagText: `Incluir calificaciones del período Anual`,
  },
  {
    itemText: `Período de acreditación`,
    value: 'acreditacion',
    tagText: `Incluir calificaciones del período de Acreditación`,
  },
]

function CalifParcialesFilter({
  allFiltersValues = {},
}: {
  allFiltersValues: FiltersValues
}) {
  const anioValue = allFiltersValues.anio || `${ANIO_ACTUAL}`
  if (anioValue === '2023') return false

  const filterValue = allFiltersValues.califParciales
  const filterItemsData = PERIODOS.map(({ value, itemText }) => {
    const isSelected = filterValue === value
    const isDisabled =
      isDisabledPeriod(anioValue, value) || value === 'acreditacion'
    return { value, itemText, isSelected, isDisabled }
  })

  return (
    <div className="w-full rounded-md border">
      <FilterInput
        title="Calif. parciales"
        icon={
          <ChartCandlestick
            strokeWidth={1.3}
            className="w-[16px] lg:w-[17px]"
          />
        }
        content={
          <CalifParcialesFilterContent
            filterValue={filterValue}
            filterItemsData={filterItemsData}
          />
        }
      />
      {filterValue && <CalifParcialesTags filterValue={filterValue} />}
    </div>
  )
}

export default CalifParcialesFilter

function isDisabledPeriod(
  anio: string,
  value: (typeof PERIODOS)[number]['value'],
) {
  if (anio !== `${ANIO_ACTUAL}`) return false
  if (!AGENDA_ANIO_ACTUAL[value]) return true
  const {
    anio: anioCarga,
    mes,
    dia,
  } = AGENDA_ANIO_ACTUAL[value].fechaInicioCarga
  const timeFechaCarga = new Date(anioCarga, mes - 1, dia).getTime()
  return timeFechaCarga > new Date().getTime()
}
