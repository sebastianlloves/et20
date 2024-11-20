import { usePathname, useRouter, useSearchParams } from 'next/navigation'

function useParamsState() {
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

export default useParamsState
