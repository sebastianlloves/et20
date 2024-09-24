import { Book, Bookmark, BookmarkX, BookX, Check, CircleX, SquareX, Lock, BookLock, AlertTriangle, TrendingDown } from 'lucide-react'
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
      <Collapsible open={open}>
        {subjects.length === 0 ? (
          <Badge
            variant="success"
            className="flex w-fit gap-x-2 rounded-md border-0 bg-success/[0.05] pl-2 font-normal"
          >
            <Check size={16} strokeWidth="1.0px" />
            No adeuda
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="rounded-md bg-muted text-sm font-medium"
          >
            {subjects.length}
          </Badge>
        )}

        <CollapsibleContent className="ml-0.5 mt-4 flex flex-col items-start space-y-3">
          {subjects.map((subject) => (
            <div
              key={subject}
              className="flex items-start justify-start gap-1.5"
            >
              <TrendingDown
                size={15}
                strokeWidth="1.4px"
                className={cn('shrink-0 text-destructive', iconColor)}
              />
              <p className="text-pretty text-xs font-normal text-foreground/85">
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
