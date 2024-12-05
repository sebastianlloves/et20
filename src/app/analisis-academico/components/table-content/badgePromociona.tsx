import 'server-only'
import { Badge } from '@/components/ui/badge'
import { BadgeCheck } from 'lucide-react'

function BadgePromociona() {
  return (
    <Badge
      variant="destructive"
      className="justify-center gap-x-1.5 px-2 py-[2px] capitalize lg:px-[10px]"
    >
      <BadgeCheck strokeWidth="1.5px" className="w-[16px]" />
      Promociona
    </Badge>
  )
}

export default BadgePromociona
