'use client'

import { FiltersValues } from '@/app/analisis-academico/utils/definitions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStateInUrl } from '@/hooks/useParamsState'
import { cn } from '@/lib/utils'
import { Search, X } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'

function SearchBar({
  className,
  allFiltersValues,
}: {
  className?: string
  allFiltersValues: FiltersValues
}) {
  const { updateSearchParams } = useStateInUrl()

  const updateUrlParams = useDebouncedCallback((term?: string) => {
    updateSearchParams([{ keyParam: 'search', newState: term }])
  }, 500)

  return (
    <div
      className={cn('relative flex p-1 lg:w-1/3 lg:min-w-64 lg:p-0', className)}
    >
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <Search
        strokeWidth={1.2}
        className="absolute left-3 top-1/2 w-[18px] -translate-y-1/2 text-muted-foreground/80 lg:top-[calc(50%-2px)] lg:w-[20px]"
      />
      <Input
        name="search"
        key={allFiltersValues.search?.toString()}
        className="peer block bg-popover pl-10 pr-9 text-xs lg:pl-12 lg:text-sm"
        placeholder="Buscar por nombre o DNI"
        defaultValue={allFiltersValues.search?.join(' ')}
        onChange={(e) => updateUrlParams(e.target.value)}
      />
      <Button
        variant="ghost"
        disabled={!allFiltersValues.search}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-0 text-muted-foreground hover:bg-inherit hover:text-foreground disabled:opacity-30 lg:top-[calc(50%-2px)]"
        onClick={() => updateUrlParams()}
      >
        <X size={16} />
      </Button>
    </div>
  )
}

export default SearchBar
