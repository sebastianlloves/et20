import 'server-only'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ListFilter } from 'lucide-react'
import ToggleDB from './filters/toggle-db'
import SearchBar from './filters/search/search-bar'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { FiltersValues } from '../utils/definitions'

function FiltersResponsiveWrapper({
  children,
  allFiltersValues,
  className,
}: {
  children: ReactNode
  allFiltersValues: FiltersValues
  className?: string
}) {
  return (
    <div className={cn('flex gap-x-3', className)}>
      <Sheet>
        <SheetTrigger asChild>
          <Button size="sm" className="justify-start gap-x-2">
            <ListFilter
              size={14}
              strokeWidth={2.0}
              className="min-w-6 dark:text-foreground"
            />
            <h4 className="font-semibold tracking-tight dark:text-foreground">
              Filtros
            </h4>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[250px] p-0 pl-2.5 pt-10">
          <SheetHeader className="sr-only">
            <SheetTitle>Filtros</SheetTitle>
            <SheetDescription>Panel de filtros</SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[90dvh] pr-3">
            <div className="flex flex-col gap-10">
              <ToggleDB />
              <SearchBar allFiltersValues={allFiltersValues} />
              {children}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default FiltersResponsiveWrapper
