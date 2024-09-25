'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

function SearchBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { replace } = useRouter()

  const updateUrlParams = useDebouncedCallback((term?: string) => {
    const params = new URLSearchParams(searchParams)
    term ? params.set('search', term) : params.delete('search')
    replace(`${pathname}?${params.toString()}`)
  }, 500)

  return (
    <div className="relative flex w-2/3 lg:w-1/3 ">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <Search
        size={20}
        strokeWidth={1.2}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/80"
      />
      <Input
        key={searchParams.get('search')}
        name="search"
        className="peer block bg-popover pl-12 pr-9"
        placeholder="Buscar estudiante por nombre o DNI"
        defaultValue={searchParams.get('search')?.toString()}
        onChange={(e) => updateUrlParams(e.target.value)}
      />
      <Button
        variant="ghost"
        disabled={!searchParams.get('search')}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-0 text-muted-foreground hover:bg-inherit hover:text-foreground"
        onClick={() => updateUrlParams()}
      >
        <X size={16} />
      </Button>
    </div>
  )
}

export default SearchBar
