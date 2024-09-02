'use client'

import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

function PromocionContent() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = new URLSearchParams(useSearchParams())
  const promocionParams = searchParams.get('promocion')

  const handleChange = (value: string) => {
    promocionParams === value
      ? searchParams.delete('promocion')
      : searchParams.set('promocion', value)
    replace(`${pathname}?${searchParams.toString()}`)
  }

  return (
    <DropdownMenuRadioGroup
      value={promocionParams || undefined}
      onValueChange={(value) => handleChange(value)}
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

export default PromocionContent
