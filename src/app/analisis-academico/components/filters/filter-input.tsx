import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { ReactNode } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface FilterProps {
  content: ReactNode | ReactNode[]
  title: string
  icon?: ReactNode
}

function FilterInput({
  content,
  title,
  icon,
}: FilterProps) {
  return (
    <div className="text-xs lg:text-sm">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-9 w-full py-2 text-[length:inherit] font-medium tracking-wide shadow-sm lg:h-10"
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
            <div className="max-h-[calc(var(--radix-dropdown-menu-content-available-height)-20px)] sm:max-h-[80vh]">
              {content}
            </div>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default FilterInput
