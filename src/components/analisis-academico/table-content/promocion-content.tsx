import { BadgeCheck, CircleAlert } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface PromocionContentProps {
  value: 'faltan datos' | 'promociona' | 'permanece'
}

function PromocionContent({ value }: PromocionContentProps) {
  return (
    <div className="">
      {value === 'faltan datos' ? (
        <p className="capitalize text-muted-foreground">{value}</p>
      ) : (
        <Badge
          variant={value === 'promociona' ? 'success' : 'destructive'}
          className="justify-center gap-x-1.5 px-2 py-[2px] capitalize lg:px-[10px]"
        >
          {value === 'promociona' ? (
            <BadgeCheck strokeWidth="1.5px" className='w-[16px]' />
          ) : (
            <CircleAlert strokeWidth="1.7px" className='w-[16px]' />
          )}
          {value}
        </Badge>
      )}
    </div>
  )
}

export default PromocionContent
