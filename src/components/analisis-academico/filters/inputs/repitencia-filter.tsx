import {
  FILTERS_FNS,
  getQuantity,
  getStudentsUniqueValues,
} from '@/app/analisis-academico/utils/dataOperations'
import { TableFilterProps } from './cursos-filter'
import Filter from './filter'
import { IterationCcw } from 'lucide-react'
// import { detectServerOrClientSide } from '@/lib/utils'
import { updateArrParamState } from '@/app/analisis-academico/utils/urlParamsOperations'
import { ANIOS_REPETIBLES } from '@/app/analisis-academico/utils/constants'
import {
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import MenuItem from '../menu-item'
import SliderItem from '../slider-item'
import { getCantRepitenciasString } from '@/app/analisis-academico/utils/utils'
import { getNumbersBetween } from '@/lib/utils'

function RepitenciaFilter({ searchParams, data }: TableFilterProps) {
  // detectServerOrClientSide('RepitenciaFilter2')
  const aniosUniqueValues =
    data &&
    getStudentsUniqueValues(
      data,
      {
        ...searchParams,
        repitenciaAnios: undefined,
      },
      'repitencia',
      true,
    )
  const cantUniqueValues =
    data &&
    getStudentsUniqueValues(
      data,
      {
        ...searchParams,
        repitenciaCant: undefined,
      },
      'repitencia',
      true,
    )
  const cantMinMaxValues = data && FILTERS_FNS.repitencia.getMinMaxCant(data)

  const { aniosValue: repAniosValue, cantValue: repCantValue } =
    FILTERS_FNS.repitencia.formatParam(
      searchParams.repitenciaAnios,
      searchParams.repitenciaCant,
      cantMinMaxValues,
    )
  const repAniosTags = repAniosValue.map((value) => {
    const tagText = `Repitió ${value}`
    const quantity = getQuantity(value, aniosUniqueValues)
    const newQueryState = {
      ...searchParams,
      repitenciaAnios: updateArrParamState(value, repAniosValue),
    }
    return { value, tagText, quantity, newQueryState }
  })

  const repCantTag = repCantValue && {
    value: repCantValue.join('_'),
    tagText: getCantRepitenciasString(repCantValue),
    quantity: getQuantity(
      getNumbersBetween(repCantValue).map((number) => `cant_${number}`),
      cantUniqueValues,
    ),
    newQueryState: {
      ...searchParams,
      repitenciaCant: undefined,
    },
  }

  const filterTags = [...repAniosTags, repCantTag].filter(
    (tag) => tag !== undefined,
  )

  return (
    <Filter
      title="Repitencia"
      maxTags={3}
      icon={<IterationCcw strokeWidth={1.4} className="w-[14px] lg:w-[15px]" />}
      filterTags={filterTags}
      paramKeys={['repitenciaAnios', 'repitenciaCant']}
    >
      <>
        {ANIOS_REPETIBLES.map((anio) => (
          <DropdownMenuCheckboxItem
            key={anio}
            checked={repAniosValue.includes(anio)}
            disabled={!aniosUniqueValues || !aniosUniqueValues.get(anio)}
            className="cursor-pointer sm:w-full"
          >
            <MenuItem
              value={`Repitió ${anio}`}
              quantity={aniosUniqueValues && (aniosUniqueValues.get(anio) ?? 0)}
              newQueryState={{
                ...searchParams,
                repitenciaAnios: updateArrParamState(anio, repAniosValue),
              }}
              paramKeys={['repitenciaAnios']}
            />
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator className="mx-1" />

        <SliderItem
          title="Cantidad"
          min={cantMinMaxValues?.[0] || 0}
          max={cantMinMaxValues?.[1] || 0}
          paramKey="repitenciaCant"
          filterValue={repCantValue}
        />
      </>
    </Filter>
  )
}

export default RepitenciaFilter
