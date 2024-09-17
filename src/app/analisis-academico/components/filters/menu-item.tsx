'use client'

export default function MenuItem({
  value,
  quantity,
}: {
  value: string
  quantity?: number
}) {
  return (
    <div className="flex w-full items-end justify-between gap-x-7">
      <h4 className="align-middle text-sm">{value}</h4>
      {quantity !== undefined && (
        <p className="w-5 text-right align-middle font-mono leading-tight text-muted-foreground/90">
          {quantity}
        </p>
      )}
    </div>
  )
}
