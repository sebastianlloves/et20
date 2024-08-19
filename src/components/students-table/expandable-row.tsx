import { Check } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Collapsible, CollapsibleContent } from '../ui/collapsible'

function ExpandableRow ({ subjects, open }: {subjects: string[], open: boolean}) {
  return (
    <>
      <Collapsible open={open}>
        {subjects.length === 0
          ? (
              <Badge
                variant='outline'
                className='flex gap-x-2 px-3 text-xs rounded-md font-normal border-0 text-success bg-success/[0.05]'>
                <Check size={16} strokeWidth='1.0px' />No adeuda
              </Badge>
            )
          : (
              <Badge
                variant='secondary'
                className='rounded-md text-sm font-medium bg-secondary/80'
              >
                {subjects.length}
              </Badge>
            )}

        <CollapsibleContent className='flex flex-col items-start space-y-2 mt-2 ml-2'>
          {subjects.map(subject => (
            <Badge
              key={subject}
              variant='secondary'
              className='w-fit text-pretty text-xs px-2 rounded-md font-normal bg-secondary/80'
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
