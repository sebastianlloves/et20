'use client'

import {
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { CURSOS_POR_ANIO, MATERIAS_POR_CURSO } from '@/lib/constants'

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

function MateriasFilterContent({
  filterValue,
  updateParams,
}: {
  filterValue?: string[]
  updateParams: (materia: string) => void
}) {
  return (
    <>
      {Object.keys(MATERIAS_POR_CURSO).map((anio) => (
        <DropdownMenuSub key={anio}>
          <DropdownMenuSubTrigger>{anio}</DropdownMenuSubTrigger>
          <DropdownMenuSubContent alignOffset={-5} sideOffset={6}>
            {MATERIAS_POR_CURSO[anio as keyof typeof MATERIAS_POR_CURSO].map(
              ({ nombre: materia }) => (
                <DropdownMenuCheckboxItem
                  key={materia}
                  onSelect={(e) => {
                    e.preventDefault()
                    updateParams(`${materia} (${anio.split(' ')[0]})`)
                  }}
                  className="cursor-pointer"
                  onChange={() =>
                    updateParams(`${materia} (${anio.split(' ')[0]})`)
                  }
                >
                  {materia}
                </DropdownMenuCheckboxItem>
              ),
            )}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      ))}
    </>
  )
}

export { CursosFilterContent, PromocionFilterContent, MateriasFilterContent }
