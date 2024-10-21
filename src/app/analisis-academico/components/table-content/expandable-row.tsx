import { Check, AlertTriangle, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { MateriasPendientes } from '@/lib/definitions'

function ExpandableRow({
  subjects,
  open,
  iconColor,
}: {
  subjects: MateriasPendientes
  open: boolean
  iconColor?: string
}) {
  const { cantidad, detalle, error } = subjects
  return (
    <>
      <Collapsible
        open={open}
        className="flex items-center gap-x-3 text-[length:inherit]"
      >
        {cantidad === 0 ? (
          <Badge
            variant="success"
            className="flex w-max gap-x-2 rounded-md border-0 bg-success/[0.05] font-normal lg:px-4 lg:py-[5px]"
          >
            <Check size={16} strokeWidth="1.0px" className="-ml-1" />
            No adeuda
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="rounded-md bg-muted text-[length:inherit] font-medium"
          >
            {cantidad}
          </Badge>
        )}
        {error && (
          <AlertTriangle
            strokeWidth={1.7}
            className="w-[17px] text-yellow-600 lg:w-[18px]"
          />
        )}

        <CollapsibleContent className="ml-0.5 mt-3 flex flex-col items-start space-y-3 lg:mt-4">
          {detalle.map((subject) => (
            <div key={subject} className="flex items-start justify-start gap-1">
              <ChevronRight
                size={14}
                strokeWidth="1.5px"
                className={cn('mt-[1px] shrink-0', iconColor)}
              />
              <p className="text-pretty text-xs font-medium text-foreground/75">
                {subject}
              </p>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}

export default ExpandableRow
