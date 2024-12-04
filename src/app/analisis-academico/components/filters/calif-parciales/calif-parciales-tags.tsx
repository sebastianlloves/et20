import {
  FiltersValues,
  TagData,
} from '@/app/analisis-academico/utils/definitions'
import { TagsSection } from '../tags-section'
import { PERIODOS } from './calif-parciales-filter'

function CalifParcialesTags({
  filterValue,
}: {
  filterValue: FiltersValues['califParciales']
}) {
  const tagText = PERIODOS.find(({ value }) => value === filterValue)?.tagText
  if (!filterValue || !filterValue.length || !tagText) return false

  const filterTag: TagData = {
    value: filterValue,
    tagText,
    quantity: null,
    keyParam: 'califParciales',
    className: 'rounded-lg pl-1 bg-primary/15',
  }
  return <TagsSection tags={[filterTag]} maxTags={3} />
}

export default CalifParcialesTags
