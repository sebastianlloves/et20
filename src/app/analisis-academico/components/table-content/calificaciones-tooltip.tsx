import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { MateriasPendientes } from '@/lib/definitions'
import { cn } from '@/lib/utils'
import { AlertTriangle, ChevronRight } from 'lucide-react'

interface CalificacionesTooltipProps {
  errorCalif: Exclude<MateriasPendientes['error'], undefined>
}

function CalificacionesTooltip({ errorCalif }: CalificacionesTooltipProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertTriangle
            strokeWidth={1.7}
            className="mt-[2px] w-[16px] text-yellow-600 lg:w-[17px]"
          />
        </TooltipTrigger>
        <TooltipContent
          side="right"
          align="start"
          className="max-w-[calc(var(--radix-tooltip-content-available-width)-40px)]"
        >
          {errorCalif.type === 'Hay materias sin calificar' ? (
            <div className="grid gap-1">
              <p className="text-xs">Materia/s sin calificación:</p>
              <ul>
                {errorCalif.details?.map((materia) => (
                  <li key={materia} className="-ml-1 p-0">
                    <div className="flex items-start justify-start gap-1">
                      <ChevronRight
                        size={13}
                        strokeWidth="1.5px"
                        className={cn('mt-[2px] shrink-0')}
                      />
                      <p className="text-pretty text-xs font-normal text-foreground/85">
                        {materia}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-pretty text-xs font-normal text-foreground/85">
              {errorCalif.type}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default CalificacionesTooltip
