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
  const searchParams = useSearchParams()
  const cursosParams = searchParams.get('cursos')
  console.log(cursosParams)
  const { replace } = useRouter()

  const handleCheck = (curso: string) => {
    const params = new URLSearchParams(searchParams)
    if( !cursosParams) params.set('cursos', [curso, 2, 3].toString())
    replace(`${pathname}?${params.toString()}`)
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
                onCheckedChange={() => handleCheck(curso)}
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

/* 
{
  '1° año': [ '1° 1°', '1° 2°', '1° 3°', '1° 4°', '1° 5°', '1° 6°' ],
  '2° año': [ '2° 1°', '2° 2°', '2° 3°', '2° 4°', '2° 5°', '2° 6°' ],
  '3° año': [ '3° 1°', '3° 2°', '3° 3°', '3° 4°', '3° 5°', '3° 6°' ],
  '4° año': [ '4° 1°', '4° 2°', '4° 3°', '4° 4°' ],
  '5° año': [ '5° 1°', '5° 2°', '5° 3°', '5° 4°' ],
  '6° año': [ '6° 1°', '6° 2°' ]
}
*/
