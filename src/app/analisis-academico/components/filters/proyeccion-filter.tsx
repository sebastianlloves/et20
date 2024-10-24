'use client'

import { ChartSpline } from 'lucide-react'
import Filter from './filter'
import { CARACTER_GRADO } from '@/lib/constants'
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

function ProyeccionFilter() {
  const { pathname, replace, searchParams } = useParamsState()

  const filterValue = searchParams.get('proyeccion')
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
      ? searchParams.delete('proyeccion')
      : searchParams.set('proyeccion', value)
    replace(`${pathname}?${searchParams}`)
  }

  const handleRemoveAll = () => {
    searchParams.delete('proyeccion')
    replace(`${pathname}?${searchParams}`)
  }

  return (
    <Filter
      title="Proyección"
      icon={<ChartSpline strokeWidth={1.4} className="w-[16px] lg:w-[17px]" />}
      maxTags={3}
      filterTags={proyeccionTags}
      handleRemoveTag={handleRemoveAll}
      handleRemoveAll={handleRemoveAll}
    >
      <>
        <DropdownMenuRadioGroup
          value={filterValue || undefined}
          onValueChange={updateParams}
        >
          <DropdownMenuLabel className="max-w-[calc(var(--radix-dropdown-menu-trigger-width)-20px)] text-pretty pl-3">
            Incluir calificaciones del año en curso
          </DropdownMenuLabel>
          {periodos.map(({ itemTitle, value }) => (
            <>
              {(itemTitle === `1${CARACTER_GRADO} Cuatrimestre` ||
                itemTitle === `Período de acreditación`) && (
                <DropdownMenuSeparator className="mx-1 bg-muted-foreground/15" />
              )}
              <DropdownMenuRadioItem
                key={itemTitle}
                value={value}
                className="cursor-pointer"
              >
                <MenuItem value={itemTitle} />
              </DropdownMenuRadioItem>
            </>
          ))}
        </DropdownMenuRadioGroup>
      </>
    </Filter>
  )
}

export default ProyeccionFilter
