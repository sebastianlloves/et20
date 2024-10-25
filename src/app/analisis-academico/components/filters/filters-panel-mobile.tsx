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
import React, { ReactNode } from 'react'
import ToggleDB from './toggle-db'
import SearchBar from './search-bar'

function FiltersPanelMobile({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-x-3 lg:hidden">
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
          <ScrollArea className="h-[90vh] pr-3">
            <div className="flex flex-col gap-10">
              <ToggleDB />
              <SearchBar />
              {children}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default FiltersPanelMobile
