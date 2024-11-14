import {
  BadgeCheck,
  CircleAlert,
  GraduationCap,
  AlertTriangle,
} from 'lucide-react'
import { Badge, BadgeProps } from '@/components/ui/badge'
import { Student } from '@/lib/definitions'
import React from 'react'
import { cn } from '@/lib/utils'

interface ProyeccionContentProps {
  value: Student['proyeccion']
}

const badgeContent: {
  [key: string]: {
    variant: BadgeProps['variant']
    className: string
    icon: React.JSX.Element
  }
} = {
  Promociona: {
    variant: 'success',
    className: 'group-hover:bg-table-body',
    icon: <BadgeCheck strokeWidth="1.5px" className="w-[16px] shrink-0" />,
  },
  Permanece: {
    variant: 'destructive',
    className: 'bg-destructive/90',
    icon: <CircleAlert strokeWidth="1.7px" className="w-[16px] shrink-0" />,
  },
  Egresa: {
    variant: 'outline',
    className:
      'gap-x-2.5 px-4 text-foreground/85 border-muted-foreground/70 rounded-lg',
    icon: <GraduationCap strokeWidth="1.6px" className="w-[18px] shrink-0" />,
  },
  'Egresa (titula)': {
    variant: 'outline',
    className:
      'gap-x-2.5 px-4 text-foreground/85 border-muted-foreground/70 rounded-lg',
    icon: <GraduationCap strokeWidth="1.6px" className="w-[18px] shrink-0" />,
  },
  'Egresa (NO titula)': {
    variant: 'outline',
    className:
      'gap-x-2.5 px-4 text-destructive/80 border-destructive/60 rounded-lg',
    icon: <GraduationCap strokeWidth="1.6px" className="w-[18px] shrink-0" />,
  },
  'Faltan datos': {
    variant: 'outline',
    className:
      'text-yellow-700 border-yellow-600 rounded-lg group-hover:bg-table-body',
    icon: <AlertTriangle strokeWidth="1.7px" className="w-[16px] shrink-0" />,
  },
}

function ProyeccionContent({ value }: ProyeccionContentProps) {
  const { variant, className, icon } = badgeContent[value]
  return (
    <Badge
      variant={variant}
      className={cn(
        'justify-center gap-x-2 text-nowrap px-[10px] py-[2px] capitalize lg:px-[12px]',
        className,
      )}
    >
      {icon}
      {value}
    </Badge>
  )
}

export default ProyeccionContent
