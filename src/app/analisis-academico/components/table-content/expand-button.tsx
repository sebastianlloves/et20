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
          'flex h-7 w-6 items-center justify-center px-0 py-0 lg:h-8',
          className,
        )}
        disabled={disabled}
      >
        {isOpen ? (
          <ChevronsDownUp
            strokeWidth="1.2px"
            className="w-[13px] lg:w-[15px]"
          />
        ) : (
          <ChevronsUpDown
            strokeWidth="1.2px"
            className="w-[13px] lg:w-[15px]"
          />
        )}
        <span className="sr-only">Toggle</span>
      </Button>
    </div>
  )
}

export default ExpandButton
