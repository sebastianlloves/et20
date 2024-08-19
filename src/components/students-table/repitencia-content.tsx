import { IterationCcw, Minus } from 'lucide-react'
import { Badge } from '../ui/badge'

interface RepitenciaContentProps {
  repArray: string[]
}

function RepitenciaContent ({ repArray }: RepitenciaContentProps) {
  return (
    <div className='flex items-center justify-start gap-x-2 pt-0.5'>
      {repArray.length
        ? repArray.map((repValue, index) => (
          <Badge
            key={index}
            variant='outline'
            className='px-1.5 font-bold rounded-lg text-destructive border-destructive/40 bg-destructive/[0.03] flex justify-center items-center gap-x-1.5'
          >
            <IterationCcw size={11} strokeWidth='2px' className='text-destructive/70' />{`${repValue[0]}°`}
          </Badge>
        ))
        : (
          <Badge variant='outline' className='px-2 border-0 text-muted-foreground'>
            <Minus size={14} strokeWidth='1.5px' />
          </Badge>
          )}
    </div>
  )
}

export default RepitenciaContent
