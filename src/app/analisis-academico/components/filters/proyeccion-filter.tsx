import { ChartSpline } from 'lucide-react'
import Filter from './filter'
import { CARACTER_GRADO } from '@/lib/constants'
import { StudentCalifActuales } from '@/lib/definitions'
import {
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import MenuItem from './menu-item'
import { ScrollArea } from '@/components/ui/scroll-area'

const periodos: {
  title: string
  keys: (keyof StudentCalifActuales['materias'][number])[]
}[] = [
  { title: `1${CARACTER_GRADO} Bimestre`, keys: ['primerBimestre'] },
  { title: `2${CARACTER_GRADO} Bimestre`, keys: ['segundoBimestre'] },
  { title: `3${CARACTER_GRADO} Bimestre`, keys: ['tercerBimestre'] },
  { title: `4${CARACTER_GRADO} Bimestre`, keys: ['cuartoBimestre'] },
  { title: `1${CARACTER_GRADO} Cuatrimestre`, keys: ['primerCuatrimestre'] },
  { title: `2${CARACTER_GRADO} Cuatrimestre`, keys: ['segundoCuatrimestre'] },
  { title: `Anual`, keys: ['anual'] },
  {
    title: `Período de acreditación`,
    keys: ['anual', 'diciembre', 'febrero', 'definitiva'],
  },
]

function ProyeccionFilter() {
  return (
    <Filter
      title="Proyección"
      icon={<ChartSpline strokeWidth={1.4} className="w-[16px] lg:w-[17px]" />}
      maxTags={3}
    >
      <>
        <DropdownMenuRadioGroup>
          <DropdownMenuLabel
            inset
            className="max-w-[calc(var(--radix-dropdown-menu-trigger-width)-20px)] text-pretty"
          >
            Incluir calificaciones del año en curso
          </DropdownMenuLabel>
          {periodos.map(({ title }) => (
            <>
              {(title === `1${CARACTER_GRADO} Cuatrimestre` ||
                title === `Período de acreditación`) && (
                <DropdownMenuSeparator className="mx-1 bg-muted-foreground/15" />
              )}
              <DropdownMenuRadioItem
                key={title}
                value={title}
                className="cursor-pointer"
              >
                <MenuItem value={title} />
              </DropdownMenuRadioItem>
            </>
          ))}
        </DropdownMenuRadioGroup>
      </>
    </Filter>
  )
}

export default ProyeccionFilter
