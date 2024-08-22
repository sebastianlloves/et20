import { DB } from './constants'
import { formatStudentsResponse } from './utils'

export async function fetchStudentsData(anio: string = '2024') {
  const response = await fetch(DB[anio], {
    cache: 'force-cache',
    next: { tags: ['db2023'] },
  })
  const textData = await response.text()
  // await new Promise((resolve) => setTimeout(resolve, 2000))

  return formatStudentsResponse(textData)
}
