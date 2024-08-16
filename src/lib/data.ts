import { URL_TRAYECTORIA_2024 } from './constants'
import { formatStudentsResponse } from './utils'

export async function fetchStudentsData () {
  const response = await fetch(URL_TRAYECTORIA_2024)
  const textData = await response.text()

  return formatStudentsResponse(textData)
}
