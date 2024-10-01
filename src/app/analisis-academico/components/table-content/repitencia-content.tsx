import { IterationCcw, Minus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface RepitenciaContentProps {
  repArray: string[]
}

function RepitenciaContent({ repArray }: RepitenciaContentProps) {
  return (
    <div className="flex items-center justify-start gap-1 pt-0.5 lg:gap-2">
      {repArray.length ? (
        repArray.map((repValue, index) => (
          <Badge
            key={index}
            variant="outline"
            className="justify-center gap-x-1.5 rounded-lg border-destructive/40 bg-destructive/[0.03] px-1 font-bold leading-4 text-destructive/80 dark:border-destructive dark:bg-destructive/15 dark:text-destructive-foreground/90 lg:gap-x-[7px] lg:px-[5px]"
          >
            <IterationCcw
              strokeWidth="2px"
              className="h-[11px] w-[11px] lg:h-3 lg:w-3"
            />
            {`${repValue[0]}°`}
          </Badge>
        ))
      ) : (
        <Badge
          variant="outline"
          className="border-0 px-2 text-muted-foreground"
        >
          <Minus
            strokeWidth="1.5px"
            className="h-2.5 w-2.5 lg:h-3 lg:w-3"
          />
        </Badge>
      )}
    </div>
  )
}

export default RepitenciaContent
