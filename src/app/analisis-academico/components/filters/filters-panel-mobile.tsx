import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ListFilter } from 'lucide-react'
import React, { ReactNode } from 'react'

function FiltersPanelMobile({ children }: { children: ReactNode }) {
  return (
    <div className="block lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="justify-start gap-x-2 px-3">
            <ListFilter size={14} strokeWidth={2.0} className="min-w-6" />
            <h4 className="font-semibold tracking-tight">Filtros</h4>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[250px] p-0 pl-2.5 pt-10">
          <ScrollArea className="h-[80vh] pr-3">{children}</ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default FiltersPanelMobile
