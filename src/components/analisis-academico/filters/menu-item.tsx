'use client'

export default function MenuItem({
  value,
  quantity,
}: {
  value: string
  quantity?: number
}) {
  return (
    <div className="flex w-full items-center justify-between gap-x-4 sm:gap-x-7">
      <h4 className="align-middle">{value}</h4>
      {quantity !== undefined && (
        <p className="w-5.5 text-right align-middle font-mono leading-tight text-muted-foreground/90">
          {quantity}
        </p>
      )}
    </div>
  )
}
