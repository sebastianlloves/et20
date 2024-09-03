import { ScrollArea } from '@/components/ui/scroll-area'
import { BadgeCheck, ListFilter, Users } from 'lucide-react'
import Filter from './filter'
import PromocionContent from './promocion-content'
import { SearchParams } from '../../page'
import { CursosFilterContent } from './filters-content'
import CursosFilter from './cursos-filter'

function FiltersPanel({ searchParams }: { searchParams: SearchParams }) {
  return (
    <ScrollArea className="h-[80vh] rounded-md border bg-card shadow-sm">
      <div className="flex flex-col items-start justify-start gap-y-4 px-2 py-4">
        <div className="mb-6 flex w-1/2 items-center justify-start gap-6 px-2">
          <ListFilter size={16} className="min-w-6" />
          <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
            Filtros
          </h4>
        </div>
        <Filter
          title="Cursos"
          paramName="cursos"
          icon={<Users size={15} strokeWidth={1.4} />}
          filterTags={searchParams?.cursos?.split(',').sort()}
        >
          <CursosFilterContent />
        </Filter>
        <CursosFilter />
        {/* <Filter
          title="Promoción"
          paramName="promocion"
          content={<PromocionContent />}
          icon={<BadgeCheck size={18} strokeWidth={1.0} />}
          filterTags={
            searchParams?.promocion
              ? [
                  searchParams.promocion === 'solo promocionan'
                    ? 'Sólo estudiantes que promocionan'
                    : 'Sólo estudiantes que permanecen',
                ]
              : undefined
          }
        /> */}
      </div>
    </ScrollArea>
  )
}

export default FiltersPanel
