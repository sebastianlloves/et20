import { Check } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Collapsible, CollapsibleContent } from '../ui/collapsible'

function ExpandableRow({
  subjects,
  open,
}: {
  subjects: string[]
  open: boolean
}) {
  return (
    <>
      <Collapsible open={open}>
        {subjects.length === 0 ? (
          <Badge
            variant="outline"
            className="text-success bg-success/[0.05] flex gap-x-2 rounded-md border-0 px-3 text-xs font-normal"
          >
            <Check size={16} strokeWidth="1.0px" />
            No adeuda
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="rounded-md bg-secondary/80 text-sm font-medium"
          >
            {subjects.length}
          </Badge>
        )}

        <CollapsibleContent className="ml-2 mt-2 flex flex-col items-start space-y-2">
          {subjects.map((subject) => (
            <Badge
              key={subject}
              variant="secondary"
              className="w-fit text-pretty rounded-md bg-secondary/80 px-2 text-xs font-normal"
            >
              {subject}
            </Badge>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}

export default ExpandableRow
