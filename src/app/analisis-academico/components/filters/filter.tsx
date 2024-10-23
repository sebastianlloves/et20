import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { ReactNode } from 'react'
import { TagsBox } from './tags'
import { ScrollArea } from '@/components/ui/scroll-area'

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
    <div className="w-full rounded-md border text-xs lg:text-sm">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-min min-h-9 w-full py-2 text-[length:inherit] font-medium tracking-wide shadow-sm lg:min-h-10"
          >
            <div className="flex w-full items-center gap-3 lg:gap-4">
              {icon}
              <h4 className="text-pretty text-left">{title}</h4>
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
          className="rounded-md p-1 text-[length:inherit]"
        >
          <ScrollArea className="pr-1">
            <div className="max-h-[max(80vh,calc(var(--radix-dropdown-menu-content-available-height)-20px))]">
              {children}
            </div>
          </ScrollArea>
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
