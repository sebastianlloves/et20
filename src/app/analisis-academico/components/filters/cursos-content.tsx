'use client'

import {
  DropdownMenuCheckboxItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { CURSOS_POR_ANIO } from '@/lib/constants'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

function CursosContent() {
  const pathname = usePathname()
  const searchParams = new URLSearchParams(useSearchParams())
  const cursosParams = searchParams.get('cursos')?.split(',') || []
  const { replace } = useRouter()
  const updateParams = (curso: string) => {
    const newCursosState = cursosParams.includes(curso)
      ? cursosParams.filter((prevParam) => prevParam !== curso)
      : [...cursosParams, curso]
    newCursosState.length === 0
      ? searchParams.delete('cursos')
      : searchParams.set('cursos', newCursosState.join(','))
    replace(`${pathname}?${searchParams.toString()}`)
  }

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
                checked={cursosParams.includes(curso)}
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

export default CursosContent
