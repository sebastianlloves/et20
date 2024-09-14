import { Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'

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

        <CollapsibleContent className="ml-2 mt-4 flex flex-col items-start space-y-3">
          {subjects.map((subject) => (
            <p key={subject} className="text-pretty text-xs font-normal text-foreground/85 italic">{subject}</p>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}

export default ExpandableRow
