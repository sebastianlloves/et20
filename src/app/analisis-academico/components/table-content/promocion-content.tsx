import { BadgeCheck, CircleAlert } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface PromocionContentProps {
  value: 'faltan datos' | 'promociona' | 'permanece'
}

function PromocionContent({ value }: PromocionContentProps) {
  return (
    <div>
      {value === 'faltan datos' ? (
        <p className="capitalize text-muted-foreground">{value}</p>
      ) : (
        <Badge
          variant={value === 'promociona' ? 'success' : 'destructive'}
          className="justify-center gap-x-2 py-1.5 capitalize"
        >
          {value === 'promociona' ? (
            <BadgeCheck size={16} strokeWidth="1.5px" />
          ) : (
            <CircleAlert size={16} strokeWidth="1.5px" />
          )}
          {value}
        </Badge>
      )}
    </div>
  )
}

export default PromocionContent
