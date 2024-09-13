import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronRight } from 'lucide-react'
import { ReactNode } from 'react'
import { TagsBox } from './tags'

interface FilterProps {
  children: ReactNode | ReactNode[]
  title: string
  maxTags: number
  icon?: ReactNode
  filterTags?: string[]
  uniqueValues?: Map<any, number>
  handleRemoveTag: (value: string) => void
  handleRemoveAll: () => void
}

function Filter({
  children,
  title,
  maxTags,
  icon,
  filterTags = [],
  uniqueValues,
  handleRemoveTag,
  handleRemoveAll,
}: FilterProps) {
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
          {children}
        </DropdownMenuContent>
      </DropdownMenu>

      {filterTags.length > 0 && (
        <TagsBox
          tags={filterTags}
          uniqueValues={uniqueValues}
          maxTags={maxTags}
          handleRemoveTag={handleRemoveTag}
          handleRemoveAll={handleRemoveAll}
        />
      )}
    </div>
  )
}

export default Filter
