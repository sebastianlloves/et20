import { SearchParams } from '@/app/analisis-academico/utils/definitions'
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
  const searchParams = new URLSearchParams(useSearchParams())
  const { replace } = useRouter()

  function updateSearchParams(
    updateData: {
      newState?: string | Array<string | number>
      keyParam: keyof SearchParams
    }[],
    resetPage: boolean = true,
  ) {
    updateData.forEach(({ newState, keyParam }) => {
      if (!newState) searchParams.delete(keyParam)
      else {
        const newParamString = Array.isArray(newState)
          ? newState.join('_')
          : newState
        searchParams.set(keyParam, newParamString)
      }
      if (resetPage && searchParams.has('page')) searchParams.delete('page')
      replace(`${pathname}?${searchParams.toString()}`)
    })
  }
  return { pathname, searchParams, replace, updateSearchParams }
}
