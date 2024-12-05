import 'server-only'
import { Badge } from '@/components/ui/badge'
import { BadgeCheck } from 'lucide-react'

function BadgePermanece() {
  return (
    <Badge
      variant="success"
      className="justify-center gap-x-1.5 px-2 py-[2px] capitalize lg:px-[10px]"
    >
      <BadgeCheck strokeWidth="1.5px" className="w-[16px]" />
      Promociona
    </Badge>
  )
}

export default BadgePermanece
