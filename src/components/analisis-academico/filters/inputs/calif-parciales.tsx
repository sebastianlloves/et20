import { ChartCandlestick } from 'lucide-react'
import Filter from '../filter'
import { TableFilterProps } from './cursos-filter'
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
import MenuItem from '../menu-item'

const periodos: {
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

function CalifParcialesFilter({ searchParams, data }: TableFilterProps) {  
  const anio = searchParams.anio || `${ANIO_ACTUAL}`
  const filterValue = searchParams.califParciales
  const filterData = periodos.find(({ value }) => value === filterValue)
  const filterTags = filterData
    ? [
        {
          value: filterData.value,
          tagText: filterData.tagText,
          quantity: null,
          newQueryState: {
            ...searchParams,
            califParciales: undefined,
          },
          className: 'rounded-lg pl-1 bg-primary/15',
        },
      ]
    : []

  if (anio === '2023') return false

  return (
    <Filter
      title="Calif. Parciales"
      maxTags={3}
      icon={
        <ChartCandlestick strokeWidth={1.3} className="w-[16px] lg:w-[17px]" />
      }
      filterTags={filterTags}
      paramKeys={['califParciales']}
    >
      <DropdownMenuRadioGroup value={filterValue || undefined}>
        <DropdownMenuLabel className="max-w-[var(--radix-dropdown-menu-trigger-width)] text-pretty pl-3">
          Incluir calificaciones del año en curso
        </DropdownMenuLabel>
        {periodos.map(({ value, itemText }) => (
          <div key={itemText}>
            {(itemText === `1${CARACTER_GRADO} Cuatrimestre` ||
              itemText === `Período de acreditación`) && (
              <DropdownMenuSeparator className="mx-1 bg-muted-foreground/15" />
            )}
            <DropdownMenuRadioItem
              value={value}
              className="cursor-pointer"
              disabled={isDisabled(anio, value)}
            >
              <MenuItem
                value={itemText}
                newQueryState={{
                  ...searchParams,
                  califParciales: filterValue !== value ? value : undefined,
                }}
                paramKeys={['califParciales']}
              />
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
