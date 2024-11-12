import { SearchParams } from '@/app/analisis-academico/page'
import Link from 'next/link'

export default function NewMenuItem({
  value,
  quantity,
  pathname,
  query,
}: {
  value: string
  pathname: string
  query: SearchParams
  quantity?: number
}) {
  return (
    <Link
      className="flex w-full items-center justify-between gap-x-4 sm:gap-x-7"
      href={{
        pathname,
        query: JSON.parse(JSON.stringify(query)),
      }}
    >
      <h4 className="align-middle">{value}</h4>
      {quantity !== undefined && (
        <p className="w-5.5 text-right align-middle font-mono leading-tight text-muted-foreground/90">
          {quantity}
        </p>
      )}
    </Link>
  )
}
