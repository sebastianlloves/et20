import { Suspense } from 'react'
import ToggleDB from './components/filters/inputs/toggle-db'
import SearchBar from './components/filters/inputs/search-bar'
import SkeletonStudentsTable from './components/skeletons/skeleton-students-table'
import StudentsTable from './components/students-table'

const searchParamsKeys = [
  'anio',
  'search',
  'cursos',
  'materias',
  'califParciales',
  'inclusionEstricta',
  'cantidadesTroncales',
  'cantidadesGenerales',
  'cantidadesEnProceso2020',
  'enProceso2020',
  'cantOptativo',
  'repitenciaAnios',
  'repitenciaCant',
  'proyeccion',
  'page',
  'sort',
] as const

export type SearchParams = {
  // eslint-disable-next-line no-unused-vars
  [key in typeof searchParamsKeys[number]]?: string
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const awaitedSearchParams = await searchParams
  const filterValues = getFiltersValues(awaitedSearchParams)
  console.log(filterValues)
  return (
    <div className="grid w-full grid-rows-[auto_auto_auto] gap-x-6 gap-y-3 px-0 lg:grid-cols-[minmax(230px,1fr)_7fr] lg:px-4 xl:gap-x-8 xl:gap-y-4 2xl:px-8">
      <ToggleDB className="hidden lg:block" />
      <SearchBar className="hidden lg:block" />
      <Suspense
        key={JSON.stringify(awaitedSearchParams)}
        fallback={<SkeletonStudentsTable searchParams={awaitedSearchParams} />}
      >
        <StudentsTable searchParams={awaitedSearchParams} />
      </Suspense>
    </div>
  )
}

type FiltersValues = Partial<
  Record<keyof SearchParams, string | string[] | number[]>
> /* {
  [key in keyof SearchParams]: string | string[] | number[]
} */

function getFiltersValues(searchParams: object): FiltersValues {
  const filtersValues: FiltersValues = {}
  Object.keys(searchParams).forEach((key) => {
    if (searchParamsKeys.includes(key)) {
      const param = searchParams[key]
      if (param !== undefined) {
        filtersValues[key] = param
      }
    }
  })
  return filtersValues
}

const isValidKey = <T extends object>(
  key: string,
  object: T,
): key is Extract<keyof T, string> => key in object
const isKeyOfType = <T extends object>(
  key: string,
): key is Extract<keyof T, string> => key in ({} as T)
