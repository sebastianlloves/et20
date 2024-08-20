import { DB } from './constants'
import { formatStudentsResponse } from './utils'

export async function fetchStudentsData(anio: string) {
  const response = await fetch(DB[anio])
  const textData = await response.text()
  await new Promise((resolve) => setTimeout(resolve, 2000))

  return formatStudentsResponse(textData)
}
