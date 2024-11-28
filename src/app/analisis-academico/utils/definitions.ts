import { Student } from "@/lib/definitions"
import { SearchParams } from "../page"

export interface TableFilterProps {
  searchParams: SearchParams
  data?: Student[]
}
