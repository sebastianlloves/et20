import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { ReactNode } from 'react'
import { TagsBox } from './tags'

interface FilterProps {
  children: ReactNode | ReactNode[]
  title: string
  maxTags: number
  icon?: ReactNode
  filterTags?: { value: string; quantity?: number | null }[]
  handleRemoveTag: (value: string) => void
  handleRemoveAll: () => void
}

function Filter({
  children,
  title,
  maxTags,
  icon,
  filterTags = [],
  handleRemoveTag,
  handleRemoveAll,
}: FilterProps) {
  return (
    <div className="w-full rounded-md border">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full font-medium tracking-wide shadow-sm"
          >
            <div className="flex w-full items-center gap-4 py-2">
              {icon}
              <h4 className="w-2/3 text-wrap text-left">{title}</h4>
            </div>
            <ChevronRight
              size={16}
              className="ml-auto hidden text-muted-foreground sm:block"
            />
            <ChevronDown
              size={16}
              className="ml-auto block text-muted-foreground sm:hidden"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          alignOffset={-1}
          className="rounded-md p-1"
        >
          {children}
        </DropdownMenuContent>
      </DropdownMenu>

      {filterTags.length > 0 && (
        <TagsBox
          tags={filterTags}
          maxTags={maxTags}
          handleRemoveTag={handleRemoveTag}
          handleRemoveAll={handleRemoveAll}
        />
      )}
    </div>
  )
}

export default Filter
