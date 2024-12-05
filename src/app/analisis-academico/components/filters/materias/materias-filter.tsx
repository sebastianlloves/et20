import {
  FiltersValues,
  ItemData,
} from '@/app/analisis-academico/utils/definitions'
import MateriasFilterContent from './materias-filter-content'
import {
  getGrupalItemData,
  getQuantity,
  getUniqueValuesModel,
} from '@/app/analisis-academico/utils/dataOperations'
import FilterInput from '../filter-input'
import { Book } from 'lucide-react'
import MateriasTags from './materias-tags'
import { MATERIAS_ITEMS_DATA } from '@/app/analisis-academico/utils/constants'
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import InclusionEstrictaFilterContent from './inclusion-estricta-filter-content'

function MateriasFilter({
  allFiltersValues,
  uniqueValuesModel,
}: {
  allFiltersValues: FiltersValues
  uniqueValuesModel?: ReturnType<typeof getUniqueValuesModel>
}) {
  const filterValue = allFiltersValues.materias
  const uniqueValues = uniqueValuesModel?.materias

  const aniosItemsData = MATERIAS_ITEMS_DATA.aniosEspecificos.map(
    ({ anio, materiasPM, materiasTICs, todas }) => {
      const partialFilterValues = filterValue?.filter(
        (value) => value.split('(')?.[1]?.[0] === anio[0],
      )

      const { quantity: ticsQuantity, isSelected: ticsIsSelected } =
        getGrupalItemData(materiasTICs, partialFilterValues, uniqueValues)
      const todasTics: ItemData = {
        value: materiasTICs,
        itemText: 'TICs',
        quantity: ticsQuantity,
        isSelected: ticsIsSelected,
        isDisabled: ticsQuantity === 0 && !ticsIsSelected,
      }
      const { quantity: pmQuantity, isSelected: pmIsSelected } =
        getGrupalItemData(materiasPM, partialFilterValues, uniqueValues)
      const todasPm: ItemData = {
        value: materiasPM,
        itemText: 'Prod. Multimedial',
        quantity: pmQuantity,
        isSelected: pmIsSelected,
        isDisabled: pmQuantity === 0 && !pmIsSelected,
      }

      const { quantity: todasQuantity, isSelected: todasIsSelected } =
        getGrupalItemData(todas, partialFilterValues, uniqueValues)
      const todasAnio: ItemData = {
        value: todas,
        itemText: `Todos las materias de ${anio}`,
        quantity: todasQuantity,
        isSelected: todasIsSelected,
        isDisabled: todasQuantity === 0 && !todasIsSelected,
      }
      const materiasAnioItems: ItemData[] = todas.map((materia) => {
        const quantity = getQuantity(materia, uniqueValues)
        const isSelected = filterValue?.includes(materia)
        return {
          value: materia,
          itemText: materia,
          quantity,
          isSelected,
          isDisabled: !isSelected && !quantity,
        }
      })

      return {
        anio,
        partialFilterValues,
        materiasAnioItems,
        orientaciones:
          materiasTICs.length || materiasPM.length
            ? [todasTics, todasPm]
            : undefined,
        todasAnio,
      }
    },
  )

  const todosAniosItemsData: ItemData[] = MATERIAS_ITEMS_DATA.todosAnios.map(
    ({ value, itemText }) => {
      const { quantity, isSelected } = getGrupalItemData(
        value,
        filterValue,
        uniqueValues,
      )
      return {
        value,
        itemText,
        quantity,
        isSelected,
        isDisabled: !isSelected && !quantity,
      }
    },
  )

  const strictInclusionValue = allFiltersValues.inclusionEstricta
  const strictInclusionIsSelected = strictInclusionValue === 'true'
  const strictInclusionItemData: ItemData = {
    value: 'true',
    itemText: 'Inclusión estricta',
    isSelected: strictInclusionIsSelected,
    isDisabled:
      (!filterValue || filterValue.length <= 1) && !strictInclusionIsSelected,
  }

  return (
    <div className="w-full rounded-md border">
      <FilterInput
        title="Materias"
        icon={<Book strokeWidth={1.4} className="w-[14px] lg:w-[15px]" />}
        content={
          <div className="text-xs lg:text-sm">
            <MateriasFilterContent
              aniosItemsData={aniosItemsData}
              todosItemsData={todosAniosItemsData}
              filterValue={filterValue}
            />
            <DropdownMenuSeparator className="mx-1" />
            <InclusionEstrictaFilterContent
              itemData={strictInclusionItemData}
            />
          </div>
        }
      />
      {(filterValue || strictInclusionValue) && (
        <MateriasTags
          filtersValues={allFiltersValues}
          uniqueValuesModel={uniqueValuesModel}
        />
      )}
    </div>
  )
}

export default MateriasFilter
