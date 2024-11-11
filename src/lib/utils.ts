import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Student } from './definitions'
import { INSTANCIAS_ANIO } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidInstancia(
  instancia: string,
): instancia is (typeof INSTANCIAS_ANIO)[number] {
  return (
    instancia === 'acreditacion' ||
    INSTANCIAS_ANIO.includes(instancia as (typeof INSTANCIAS_ANIO)[number])
  )
}

export const getPagination = (
  rowsCount: number,
  maxCantButtons: number,
  pageParam?: string,
  filteredData?: Student[],
) => {
  const firstPage = 1
  const currentPageParam = Number(pageParam?.split('_')[0])
  const lastPageParam = Number(pageParam?.split('_')[1])
  if (filteredData === undefined)
    return {
      paginatedData: Array(rowsCount).fill({}),
      currentPage: currentPageParam || null,
      lastPage: lastPageParam || null,
      indexFirstElement: null,
      indexLastElement: null,
      totalSize: null,
      pagesButtons: Array(maxCantButtons).fill(null),
    }

  const lastPage =
    lastPageParam || Math.ceil((filteredData.length || 1) / rowsCount)
  const currentPage =
    currentPageParam >= firstPage && currentPageParam <= lastPage
      ? currentPageParam
      : 1
  const pageIndex = currentPage - 1
  const data = filteredData.slice(
    pageIndex * rowsCount,
    pageIndex * rowsCount + rowsCount,
  )
  const indexFirstElement =
    filteredData.findIndex(({ dni }) => dni === data.at(0)?.dni) + 1
  const indexLastElement =
    filteredData.findIndex(({ dni }) => dni === data.at(-1)?.dni) + 1

  const pagesButtons = getPagesButtons(currentPage, lastPage, maxCantButtons)

  return {
    paginatedData: data,
    currentPage,
    lastPage,
    indexFirstElement,
    indexLastElement,
    totalSize: filteredData.length,
    pagesButtons,
  }
}

const getPagesButtons = (
  currentPage: number,
  lastPage: number,
  maxCantButtons: number,
) => {
  const maxConsecutiveButtons = maxCantButtons - 2
  if (lastPage <= maxCantButtons)
    return Array.from({ length: lastPage }, (_, i) => i + 1)
  if (currentPage <= maxConsecutiveButtons - 1)
    return [
      ...Array.from({ length: maxConsecutiveButtons }, (_, i) => i + 1),
      '...',
      lastPage,
    ]
  if (lastPage - currentPage < maxConsecutiveButtons - 1)
    return [
      1,
      '...',
      ...Array.from(
        { length: maxConsecutiveButtons },
        (_, i) => lastPage - i,
      ).sort(),
    ]
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    lastPage,
  ]
}
