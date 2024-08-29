'use client'

import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

function Remove({
  paramName,
  value,
  className,
}: {
  paramName: string
  value?: string
  className: string
}) {
  const pathname = usePathname()
  const params = useSearchParams()
  const searchParams = new URLSearchParams(params)
  const { replace } = useRouter()

  const handleRemoveAll = () => {
    searchParams.delete(paramName)
    replace(`${pathname}?${searchParams}`)
  }
  const handleRemoveValue = () => {
    const previousState = searchParams.get(paramName)?.split(',') || []
    const newState = previousState.filter((prevValue) => prevValue !== value)
    newState.length
      ? searchParams.set(paramName, newState.join(','))
      : searchParams.delete(paramName)
    replace(`${pathname}?${searchParams}`)
  }

  return (
    <X
      strokeWidth="1.5px"
      className={cn('cursor-pointer', className)}
      onClick={value ? handleRemoveValue : handleRemoveAll}
    />
  )
}

export default Remove
