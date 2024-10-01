import { Button } from '@/components/ui/button'
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
        <SheetContent side="left" className="w-[300px] pt-10">
          {children}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default FiltersPanelMobile
