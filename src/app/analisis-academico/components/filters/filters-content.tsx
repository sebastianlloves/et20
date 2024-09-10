'use client'

import {
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { CURSOS_POR_ANIO, MATERIAS_POR_CURSO } from '@/lib/constants'
import { cn } from '@/lib/utils'

function Item({ value, quantity }: { value: string; quantity?: number }) {
  return (
    <div className="flex w-full items-end justify-between gap-x-7">
      <h4 className="align-middle text-sm">{value}</h4>
      <p
        className={cn(
          'w-5 text-right align-middle font-mono leading-tight text-muted-foreground/90',
          quantity === 0 && 'text-muted-foreground/60',
        )}
      >
        {quantity}
      </p>
    </div>
  )
}

function CursosFilterContent({
  filterValue,
  updateParams,
  uniqueValues,
}: {
  filterValue: string[]
  updateParams: (curso: string) => void
  uniqueValues: Map<string, number>
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
                <Item value={curso} quantity={uniqueValues.get(curso) ?? 0} />
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      ))}
    </>
  )
}

function MateriasFilterContent({
  filterValue,
  inclusionEstrictaValue,
  uniqueValues,
  updateParams,
  updateStrictInclusion,
}: {
  filterValue?: string[]
  inclusionEstrictaValue?: string
  updateParams: (materia: string) => void
  updateStrictInclusion: () => void
  uniqueValues: Map<string, number>
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
                  checked={filterValue?.includes(
                    `${materia} (${anio.split(' ')[0]})`,
                  )}
                  onSelect={(e) => {
                    e.preventDefault()
                    updateParams(`${materia} (${anio.split(' ')[0]})`)
                  }}
                  className="cursor-pointer"
                  onChange={() =>
                    updateParams(`${materia} (${anio.split(' ')[0]})`)
                  }
                >
                  <Item
                    value={`${materia} (${anio.split(' ')[0]})`}
                    quantity={
                      uniqueValues.get(`${materia} (${anio.split(' ')[0]})`) ??
                      0
                    }
                  />
                </DropdownMenuCheckboxItem>
              ),
            )}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      ))}
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
        <div className="flex items-center space-x-6 p-1">
          <Label
            htmlFor="estrict-inclusion"
            className="cursor-pointer font-normal text-foreground"
          >
            Inclusión estricta
          </Label>
          <Switch
            id="estrict-inclusion"
            className="h-4 w-8"
            onSelect={(e) => e.preventDefault()}
            checked={inclusionEstrictaValue === 'true'}
            onCheckedChange={updateStrictInclusion}
          />
        </div>
      </DropdownMenuItem>
    </>
  )
}

export {
  CursosFilterContent,
  MateriasFilterContent,
  Item,
}
