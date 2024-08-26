import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronRight } from 'lucide-react'
import { ReactNode } from 'react'
import TagsBox from './tags-box'

interface FilterBoxProps {
  content?: ReactNode | ReactNode[]
  title: string
  icon?: ReactNode
  filterValues?: string[]
}

function DropdownFilter({ title, content, icon, filterValues }: FilterBoxProps) {
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
      
      <TagsBox tags={filterValues} />      
    </div>
  )
}

export default DropdownFilter
