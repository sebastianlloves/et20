import { URL_TRAYECTORIA_2024 } from './constants'
import { formatStudentsResponse } from './utils'

export async function fetchStudentsData() {
  const response = await fetch(URL_TRAYECTORIA_2024)
  const textData = await response.text()
  await new Promise((resolve) => setTimeout(resolve, 3000))
  
  return formatStudentsResponse(textData)
}
