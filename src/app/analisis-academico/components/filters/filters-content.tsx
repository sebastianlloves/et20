'use client'

import {
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { CURSOS_POR_ANIO } from '@/lib/constants'

function CursosFilterContent({
  filterValue,
  updateParams,
}: {
  filterValue: string[]
  updateParams: (curso: string) => void
}) {
  return (
    <>
      {Object.keys(CURSOS_POR_ANIO).map((anio) => (
        <DropdownMenuSub key={anio}>
          <DropdownMenuSubTrigger className="pl-3">
            {anio}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent alignOffset={-5} sideOffset={6}>
            {CURSOS_POR_ANIO[anio].map((curso) => (
              <DropdownMenuCheckboxItem
                key={curso}
                className="cursor-pointer"
                onSelect={(e) => e.preventDefault()}
                checked={filterValue.includes(curso)}
                onCheckedChange={() => updateParams(curso)}
              >
                {curso}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      ))}
    </>
  )
}

function PromocionFilterContent({
  filterValue,
  updateParams,
}: {
  filterValue?: string
  updateParams: (promocionValue: string) => void
}) {
  return (
    <DropdownMenuRadioGroup
      value={filterValue}
      onValueChange={(value) => updateParams(value)}
    >
      <DropdownMenuRadioItem
        value="solo promocionan"
        onSelect={(e) => e.preventDefault()}
        className="cursor-pointer"
      >
        Sólo estudiantes que promocionan
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem
        value="solo permanecen"
        onSelect={(e) => e.preventDefault()}
        className="cursor-pointer"
      >
        Sólo estudiantes que permanecen
      </DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  )
}

export { CursosFilterContent, PromocionFilterContent }
