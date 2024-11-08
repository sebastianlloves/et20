'use client'

import { ChartCandlestick } from 'lucide-react'
import Filter from './filter'
import {
  AGENDA_ANIO_ACTUAL,
  ANIO_ACTUAL,
  CARACTER_GRADO,
} from '@/lib/constants'
import { StudentCalifActuales } from '@/lib/definitions'
import {
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import MenuItem from './menu-item'
import useParamsState from '@/hooks/useParamsState'

const periodos: {
  itemTitle: string
  tagTitle: string
  value: keyof StudentCalifActuales['materias'][number] | 'acreditacion'
}[] = [
  {
    itemTitle: `1${CARACTER_GRADO} Bimestre`,
    value: 'primerBimestre',
    tagTitle: `Incluir calificaciones del 1${CARACTER_GRADO} Bimestre`,
  },
  {
    itemTitle: `2${CARACTER_GRADO} Bimestre`,
    value: 'segundoBimestre',
    tagTitle: `Incluir calificaciones del 2${CARACTER_GRADO} Bimestre`,
  },
  {
    itemTitle: `3${CARACTER_GRADO} Bimestre`,
    value: 'tercerBimestre',
    tagTitle: `Incluir calificaciones del 3${CARACTER_GRADO} Bimestre`,
  },
  {
    itemTitle: `4${CARACTER_GRADO} Bimestre`,
    value: 'cuartoBimestre',
    tagTitle: `Incluir calificaciones del 4${CARACTER_GRADO} Bimestre`,
  },
  {
    itemTitle: `1${CARACTER_GRADO} Cuatrimestre`,
    value: 'primerCuatrimestre',
    tagTitle: `Incluir calificaciones del 1${CARACTER_GRADO} Cuatrimestre`,
  },
  {
    itemTitle: `2${CARACTER_GRADO} Cuatrimestre`,
    value: 'segundoCuatrimestre',
    tagTitle: `Incluir calificaciones del 2${CARACTER_GRADO} Cuatrimestre`,
  },
  {
    itemTitle: `Anual`,
    value: 'anual',
    tagTitle: `Incluir calificaciones del período Anual`,
  },
  {
    itemTitle: `Período de acreditación`,
    value: 'acreditacion',
    tagTitle: `Incluir calificaciones del período de Acreditación`,
  },
]

function CalifParcialesFilter() {
  const { pathname, replace, searchParams } = useParamsState()

  const filterValue = searchParams.get('califParciales')
  const anio = searchParams.get('anio') || `${ANIO_ACTUAL}`
  const filterValueObj = periodos.find(({ value }) => value === filterValue)
  const proyeccionTags = filterValueObj
    ? [
        {
          value: filterValueObj.tagTitle,
          quantity: null,
        },
      ]
    : []

  const updateParams = (value: string) => {
    filterValue === value
      ? searchParams.delete('califParciales')
      : searchParams.set('califParciales', value)
    if (searchParams.has('page')) searchParams.delete('page')
    replace(`${pathname}?${searchParams}`)
  }

  const handleRemoveAll = () => {
    searchParams.delete('califParciales')
    if (searchParams.has('page')) searchParams.delete('page')
    replace(`${pathname}?${searchParams}`)
  }

  if (searchParams.get('anio') === '2023') return false

  return (
    <Filter
      title="Calif. Parciales"
      icon={
        <ChartCandlestick strokeWidth={1.3} className="w-[16px] lg:w-[17px]" />
      }
      maxTags={3}
      filterTags={proyeccionTags}
      handleRemoveTag={handleRemoveAll}
      handleRemoveAll={handleRemoveAll}
    >
      <DropdownMenuRadioGroup
        value={filterValue || undefined}
        onValueChange={updateParams}
      >
        <DropdownMenuLabel className="max-w-[var(--radix-dropdown-menu-trigger-width)] text-pretty pl-3">
          Incluir calificaciones del año en curso
        </DropdownMenuLabel>
        {periodos.map(({ itemTitle, value }) => (
          <div key={itemTitle}>
            {(itemTitle === `1${CARACTER_GRADO} Cuatrimestre` ||
              itemTitle === `Período de acreditación`) && (
              <DropdownMenuSeparator className="mx-1 bg-muted-foreground/15" />
            )}
            <DropdownMenuRadioItem
              value={value}
              className="cursor-pointer"
              disabled={isDisabled(anio, value)}
            >
              <MenuItem value={itemTitle} />
            </DropdownMenuRadioItem>
          </div>
        ))}
      </DropdownMenuRadioGroup>
    </Filter>
  )
}

export default CalifParcialesFilter



const isDisabled = (
  anio: string,
  value: (typeof periodos)[number]['value'],
) => {
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
