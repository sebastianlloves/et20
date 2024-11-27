import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function useParamsState() {
  const pathname = usePathname()
  const searchParams = new URLSearchParams(useSearchParams())
  const { replace } = useRouter()
  function updateParams<T extends {}>(
    newQueryState: T,
    paramKeys: (keyof T)[],
  ) {
    paramKeys.forEach((key) => {
      const value = newQueryState[key]
      value === undefined
        ? searchParams.delete(String(key))
        : searchParams.set(String(key), `${value}`)
    })
    if (searchParams.has('page')) searchParams.delete('page')
    replace(`${pathname}?${searchParams.toString()}`)
  }

  return { pathname, searchParams, replace, updateParams }
}

export function useStateInUrl() {
  const pathname = usePathname()
  const newSearchParams = new URLSearchParams()
  const { replace } = useRouter()
  function updateSearchParams<T extends {}>(newParamsValues: T) {
    const paramsKeys = Object.keys(newParamsValues) as Array<
      Extract<keyof T, string>
    >
    paramsKeys.forEach((paramKey) => {
      const paramValue = newParamsValues[paramKey]
      if (Array.isArray(paramValue)) {
        paramValue.length > 0
          ? newSearchParams.set(paramKey, paramValue.join('_'))
          : newSearchParams.delete(paramKey)
      }
      if (typeof paramValue === 'string')
        newSearchParams.set(paramKey, paramValue)
      if (newSearchParams.has('page')) newSearchParams.delete('page')
      replace(`${pathname}?${newSearchParams.toString()}`)
    })
  }  
  return { pathname, newSearchParams, replace, updateSearchParams }
}
