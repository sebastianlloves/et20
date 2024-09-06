import { usePathname, useRouter, useSearchParams } from 'next/navigation'

function useParamsState() {
  const pathname = usePathname()
  const searchParams = new URLSearchParams(useSearchParams())
  const { replace } = useRouter()
  console.log('useParamsState')

  return { pathname, searchParams, replace }
}

export default useParamsState
