import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronRight } from 'lucide-react'
import { ReactNode } from 'react'
import { TagsBox } from './tags'

interface FilterBoxProps {
  content?: ReactNode | ReactNode[]
  title: string
  icon?: ReactNode
  filterTags?: string[]
}

function DropdownFilter({
  title,
  content,
  icon,
  filterTags,
}: FilterBoxProps) {
  return (
    <div className="w-full rounded-md border">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full py-2 font-medium tracking-wide shadow-sm"
          >
            <div className="flex items-center gap-4">
              {icon}
              <h4>{title}</h4>
            </div>
            <ChevronRight size={16} className="ml-auto text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          alignOffset={-1}
          side="right"
          className="rounded-md p-1"
        >
          {content}
        </DropdownMenuContent>
      </DropdownMenu>

      {filterTags && <TagsBox tags={filterTags} maxTags={4} />}
    </div>
  )
}

export default DropdownFilter
