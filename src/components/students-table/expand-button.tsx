import { ChevronsDownUp, ChevronsUpDown } from 'lucide-react'
import { Button } from '../ui/button'
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
  disabled,
}: ExpandButtonProps) {
  return (
    <Button
      variant='ghost'
      onClick={handleClick}
      className={cn('w-8 px-0 py-1', className)}
      disabled={disabled}
    >
      {isOpen ? (
        <ChevronsDownUp strokeWidth='1.2px' size={15} />
      ) : (
        <ChevronsUpDown strokeWidth='1.2px' size={15} />
      )}
      <span className='sr-only'>Toggle</span>
    </Button>
  )
}

export default ExpandButton
