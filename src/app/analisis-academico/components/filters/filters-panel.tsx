import { ScrollArea } from '@/components/ui/scroll-area'
import { ListFilter, Users } from 'lucide-react'
import DropdownFilter from './dropdown-filter'
import CursosContent from './cursos-content'
import { StudentsTableFilters } from '@/lib/definitions'
import PromocionContent from './promocion-content'

function FiltersPanel({ filters }: { filters?: StudentsTableFilters }) {
  /* const { anio, ...columnsFilters } = filters || {}
  const filtersData = Object.entries(columnsFilters).map(([id, value]) => {
    return {
      filterFn: FILTERS_FNS[id as keyof typeof FILTERS_FNS].filterFn,
      value,
    }
  })
  console.log(filtersData) */

  return (
    <ScrollArea className="h-[80vh] rounded-md border bg-card shadow-sm">
      <div className="flex flex-col items-start justify-start gap-y-4 px-2 py-4">
        <div className="mb-6 flex w-1/2 items-center justify-start gap-6 px-2">
          <ListFilter size={16} className="min-w-6" />
          <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
            Filtros
          </h4>
        </div>
        <DropdownFilter
          title="Cursos"
          content={<CursosContent />}
          icon={<Users size={15} strokeWidth={1.4} />}
          filterTags={filters?.cursos}
        />
        <DropdownFilter
          title="Promocion"
          content={<PromocionContent />}
          icon={<Users size={15} strokeWidth={1.4} />}
          filterTags={filters?.cursos}
        />
      </div>
    </ScrollArea>
  )
}

export default FiltersPanel
