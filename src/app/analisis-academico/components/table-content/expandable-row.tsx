import {
  /* Book, Bookmark, BookmarkX, BookX, */ Check,
  /* CircleX, SquareX, Lock, BookLock, AlertTriangle, TrendingDown, */ ChevronRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

function ExpandableRow({
  subjects,
  open,
  iconColor,
}: {
  subjects: string[]
  open: boolean
  iconColor?: string
}) {
  return (
    <>
      <Collapsible open={open} className="text-[length:inherit]">
        {subjects.length === 0 ? (
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
            {subjects.length}
          </Badge>
        )}

        <CollapsibleContent className="ml-0.5 mt-3 lg:mt-4 flex flex-col items-start space-y-3">
          {subjects.map((subject) => (
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
