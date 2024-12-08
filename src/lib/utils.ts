import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Student } from './definitions'
import { INSTANCIAS_ANIO } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const detectServerOrClientSide = (text?: string) => {
  const string = text || 'Aplication'
  console.log(
    typeof window === 'undefined'
      ? `${string} is on server side`
      : `${string} is on client side`,
  )
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
  if (filteredData === undefined) {
    const skeletonPageButtons =
      currentPageParam && lastPageParam
        ? getPagesButtons(currentPageParam, lastPageParam, maxCantButtons)
        : Array(lastPageParam || maxCantButtons).fill(null)
    return {
      paginatedData: Array(rowsCount).fill({}),
      currentPage: currentPageParam || null,
      lastPage: lastPageParam || null,
      indexFirstElement: null,
      indexLastElement: null,
      totalSize: null,
      pagesButtons: skeletonPageButtons,
    }
  }
  const lastPage =
    Math.ceil((filteredData.length || 1) / rowsCount) || lastPageParam
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

export const getNumbersBetween = (numberArr: number[]) => {
  const min = Math.min(...numberArr)
  const max = Math.max(...numberArr)
  return Array.from({ length: max - min + 1 }, (_, index) => min + index)
}
