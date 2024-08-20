import { IterationCcw, Minus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface RepitenciaContentProps {
  repArray: string[]
}

function RepitenciaContent({ repArray }: RepitenciaContentProps) {
  return (
    <div className="flex items-center justify-start gap-x-2 pt-0.5">
      {repArray.length ? (
        repArray.map((repValue, index) => (
          <Badge
            key={index}
            variant="outline"
            className="justify-center gap-x-1 rounded-lg border-destructive/40 bg-destructive/[0.03] px-1.5 font-bold leading-4 text-destructive/80 dark:border-destructive dark:bg-destructive/15 dark:text-destructive-foreground/90"
          >
            <IterationCcw size={13} strokeWidth="2px" />
            {`${repValue[0]}°`}
          </Badge>
        ))
      ) : (
        <Badge
          variant="outline"
          className="border-0 px-2 text-muted-foreground"
        >
          <Minus size={14} strokeWidth="1.5px" />
        </Badge>
      )}
    </div>
  )
}

export default RepitenciaContent
