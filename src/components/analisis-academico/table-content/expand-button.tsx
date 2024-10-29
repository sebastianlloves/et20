import { ChevronsDownUp, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ExpandButtonProps {
  handleClick: () => void
  isOpen: boolean
  className?: string
  disabled?: boolean
}

function ExpandButton({
  handleClick,
  isOpen,
  className,
  disabled = false,
}: ExpandButtonProps) {
  return (
    <div>
      <Button
        variant="ghost"
        onClick={handleClick}
        className={cn(
          'h-5.5 lg:w-5.5 flex w-5 items-center bg-inherit bg-opacity-100 justify-center px-0 py-0 lg:h-6',
          className,
        )}
        disabled={disabled}
      >
        {isOpen ? (
          <ChevronsDownUp
            strokeWidth="1.2px"
            className="w-[11px] lg:w-[14px]"
          />
        ) : (
          <ChevronsUpDown
            strokeWidth="1.2px"
            className="w-[11px] lg:w-[14px]"
          />
        )}
        <span className="sr-only">Toggle</span>
      </Button>
    </div>
  )
}

export default ExpandButton
