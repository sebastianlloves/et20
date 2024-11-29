import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function useParamsState() {
  const pathname = usePathname()
  const searchParams = new URLSearchParams(useSearchParams())
  const { replace } = useRouter()
  function updateParams<T extends {}>(
    newQueryState: T,
    paramKeys: (keyof T)[],
  ) {
    console.time('updateParams')
    paramKeys.forEach((key) => {
      const value = newQueryState[key]
      value === undefined
        ? searchParams.delete(String(key))
        : searchParams.set(String(key), `${value}`)
    })
    if (searchParams.has('page')) searchParams.delete('page')
    replace(`${pathname}?${searchParams.toString()}`)
    console.timeEnd('updateParams')
  }

  return { pathname, searchParams, replace, updateParams }
}

export function useStateInUrl() {
  const pathname = usePathname()
  const newSearchParams = new URLSearchParams()
  const { replace } = useRouter()
  function updateSearchParams<T extends {}>(newFiltersValues: T) {
    console.time('useStateInUrl')
    const filtersKeys = Object.keys(newFiltersValues) as Array<
      Extract<keyof T, string>
    >
    filtersKeys.forEach((filterKey) => {
      const paramValue = newFiltersValues[filterKey]
      if(!paramValue) newSearchParams.delete(filterKey)
      if (Array.isArray(paramValue)) {
        paramValue.length > 0
          ? newSearchParams.set(filterKey, paramValue.join('_'))
          : newSearchParams.delete(filterKey)
      }
      if (typeof paramValue === 'string')
        newSearchParams.set(filterKey, paramValue)
      if (newSearchParams.has('page')) newSearchParams.delete('page')
      replace(`${pathname}?${newSearchParams.toString()}`)
      console.timeEnd('useStateInUrl')
    })
  }
  return { pathname, newSearchParams, replace, updateSearchParams }
}
