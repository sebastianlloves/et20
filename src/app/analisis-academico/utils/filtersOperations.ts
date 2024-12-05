import 'server-only'
import { FiltersValues, SearchParams } from './definitions'
import { Student } from '@/lib/definitions'
import { ANIOS_REPETIBLES, CURSOS_ITEMS_DATA, MATERIAS_ANIOS_ITEMS_DATA, PROYECCION_DATA } from './constants'
import { isKeyOfObject } from '@/lib/typeGuards'

export const FILTERS_FNS = {
  search: {
    formatParam: (searchParams: SearchParams) => {
      const param = searchParams.search
      return param
        ? param.split(' ').map((string) =>
            string
              .trim()
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, ''),
          )
        : undefined
    },
    filterFn: (student: Student, paramsValues: FiltersValues) => {
      const filterValue = paramsValues.search
      if (filterValue === undefined) return true
      const { apellido, nombre, dni } = student
      return filterValue.every(
        (string: string) =>
          apellido?.toLowerCase().includes(string) ||
          nombre?.toLowerCase().includes(string) ||
          `${dni}`.includes(string),
      )
    },
    uniqueValuesFn: (
      filteredData: Student[],
      facetedModel: Map<string, number>,
    ) => undefined,
  },
  cursos: {
    formatParam: (searchParams: SearchParams) => {
      const param = searchParams.cursos
      return param
        ? formatArrValues(
            param,
            CURSOS_ITEMS_DATA.flatMap(({ todos }) => todos),
          )
        : undefined
    },
    filterFn: (student: Student, paramsValues: FiltersValues) => {
      const filterValue = paramsValues.cursos
      const { anio, division } = student
      if (anio === null || division === null || filterValue === undefined)
        return true
      return filterValue.includes(`${anio[0]}° ${division[0]}°`)
    },
    uniqueValuesFn: (
      filteredData: Student[],
      facetedModel: Map<string, number>,
    ) => {
      filteredData.forEach((student) => {
        const { anio, division } = student
        if (anio !== null && division !== null) {
          const value = `${anio?.[0]}° ${division?.[0]}°`
          facetedModel.set(value, (facetedModel.get(value) ?? 0) + 1)
        }
      })
    },
  },
  materias: {
    sortParam: (materiaA: string, materiaB: string) => {
      const anioA = Number(materiaA.split('(')?.[1]?.[0])
      const anioB = Number(materiaB.split('(')?.[1]?.[0])
      if (anioA !== anioB) return anioA - anioB
      return materiaA.localeCompare(materiaB)
    },
    formatParam: (searchParams: SearchParams) => {
      const param = searchParams.materias
      return param
        ? formatArrValues(
            param,
            MATERIAS_ANIOS_ITEMS_DATA.flatMap(({ todas }) => todas),
            FILTERS_FNS.materias.sortParam,
          )
        : undefined
    },
    filterFn: (student: Student, paramsValues: FiltersValues) => {
      const filterValue = paramsValues.materias
      if (filterValue === undefined) return true
      const hideEnProceso2020 = paramsValues.enProceso2020 === 'false'
      const studentMaterias = [
        ...student.troncales.detalle,
        ...student.generales.detalle,
      ]
      if (
        !hideEnProceso2020 &&
        student.enProceso2020.detalle !== 'No corresponde'
      )
        studentMaterias.push(...student.enProceso2020.detalle)

      const inclusionEstrictaValue = paramsValues.inclusionEstricta === 'true'
      return inclusionEstrictaValue
        ? filterValue.every((materia) => studentMaterias.includes(materia))
        : filterValue.some((materia) => studentMaterias.includes(materia))
    },
    uniqueValuesFn: (
      filteredData: Student[],
      facetedModel: Map<string, number>,
      filtersValues: FiltersValues,
    ) => {
      filteredData.forEach((student) => {
        const values = [
          ...student.troncales.detalle,
          ...student.generales.detalle,
        ]
        if (
          filtersValues.enProceso2020 !== 'false' &&
          student.enProceso2020.detalle !== 'No corresponde'
        )
          values.push(...student.enProceso2020.detalle)
        values.forEach((value) =>
          facetedModel.set(value, (facetedModel.get(value) ?? 0) + 1),
        )
      })
    },
  },
  cantidadesTroncales: {
    formatParam: (searchParams: SearchParams) => {
      const param = searchParams.cantidadesTroncales
      return param ? formatCantValues(param) : undefined
    },
    filterFn: (student: Student, paramsValues: FiltersValues) => {
      const cantStudent = student.troncales.cantidad
      const filterValue = paramsValues.cantidadesTroncales
      if (cantStudent === null || filterValue === undefined) return true
      const minValue = Math.min(...filterValue)
      const maxValue = Math.max(...filterValue)
      return cantStudent >= minValue && cantStudent <= maxValue
    },
    uniqueValuesFn: (
      filteredData: Student[],
      facetedModel: Map<string, number>,
    ) => {
      filteredData.forEach((student) => {
        const cant = student.troncales.cantidad
        facetedModel.set(`${cant}`, (facetedModel.get(`${cant}`) ?? 0) + 1)
      })
    },
  },
  cantidadesGenerales: {
    formatParam: (searchParams: SearchParams) => {
      const param = searchParams.cantidadesGenerales
      return param ? formatCantValues(param) : undefined
    },
    filterFn: (student: Student, paramsValues: FiltersValues) => {
      const cantStudent = student.generales.cantidad
      const filterValue = paramsValues.cantidadesGenerales
      if (cantStudent === null || filterValue === undefined) return true
      const minValue = Math.min(...filterValue)
      const maxValue = Math.max(...filterValue)
      return cantStudent >= minValue && cantStudent <= maxValue
    },
    uniqueValuesFn: (
      filteredData: Student[],
      facetedModel: Map<string, number>,
    ) => {
      filteredData.forEach((student) => {
        const cant = student.generales.cantidad
        facetedModel.set(`${cant}`, (facetedModel.get(`${cant}`) ?? 0) + 1)
      })
    },
  },
  cantidadesEnProceso2020: {
    formatParam: (searchParams: SearchParams) => {
      const param = searchParams.cantidadesEnProceso2020
      return param ? formatCantValues(param) : undefined
    },
    filterFn: (student: Student, paramsValues: FiltersValues) => {
      const cantStudent = student.enProceso2020.cantidad
      const filterValue = paramsValues.cantidadesEnProceso2020
      const hideEnProceso2020 = paramsValues.enProceso2020 === 'false'
      if (
        cantStudent === null ||
        filterValue === undefined ||
        hideEnProceso2020
      )
        return true
      const minValue = Math.min(...filterValue)
      const maxValue = Math.max(...filterValue)
      return cantStudent >= minValue && cantStudent <= maxValue
    },
    uniqueValuesFn: (
      filteredData: Student[],
      facetedModel: Map<string, number>,
    ) => {
      filteredData.forEach((student) => {
        const cant = student.enProceso2020.cantidad
        facetedModel.set(`${cant}`, (facetedModel.get(`${cant}`) ?? 0) + 1)
      })
    },
  },
  proyeccion: {
    formatParam: (searchParams: SearchParams) => {
      const param = searchParams.proyeccion
      console.log(param)
      if (param === undefined) return param
      const califParcialesParam = searchParams.califParciales
      const comparedData = califParcialesParam
        ? PROYECCION_DATA.filter(({ value }) => value !== 'Egresa')
        : PROYECCION_DATA.filter(
            ({ value }) =>
              value !== 'Egresa (titula)' && value !== 'Egresa (NO titula)',
          )
      console.log(comparedData)
      return formatArrValues(
        param,
        comparedData.map(({ value }) => value),
      )
    },
    filterFn(student: Student, paramsValues: FiltersValues) {
      const filterValue = paramsValues.proyeccion
      if (filterValue === undefined) return true
      return filterValue.some((value) => student.proyeccion === value)
    },
    uniqueValuesFn(filteredData: Student[], facetedModel: Map<string, number>) {
      filteredData.forEach((student) => {
        const { proyeccion } = student
        facetedModel.set(proyeccion, (facetedModel.get(proyeccion) ?? 0) + 1)
      })
    },
  },
  repitenciaAnios: {
    formatParam: (searchParams: SearchParams) => {
      const param = searchParams.repitenciaAnios
      return param ? formatArrValues(param, ANIOS_REPETIBLES) : undefined
    },
    filterFn(student: Student, paramsValues: FiltersValues) {
      const filterValue = paramsValues.repitenciaAnios
      if (filterValue === undefined) return true
      return student.repitencia.some((anioRepetido) =>
        filterValue.includes(anioRepetido),
      )
    },
    uniqueValuesFn(filteredData: Student[], facetedModel: Map<string, number>) {
      filteredData.forEach(({ repitencia }) => {
        const aniosRepetidos = [...new Set(repitencia)]
        aniosRepetidos.forEach((anioRepetido) =>
          facetedModel.set(
            anioRepetido,
            (facetedModel.get(anioRepetido) ?? 0) + 1,
          ),
        )
      })
    },
  },
  repitenciaCant: {
    formatParam: (searchParams: SearchParams) => {
      const param = searchParams.repitenciaCant
      return param ? formatCantValues(param) : undefined
    },
    filterFn(student: Student, paramsValues: FiltersValues) {
      const filterValue = paramsValues.repitenciaCant
      if (filterValue === undefined) return true
      const cantRep = student.repitencia.length
      const minValue = Math.min(...filterValue)
      const maxValue = Math.max(...filterValue)
      return cantRep >= minValue && cantRep <= maxValue
    },
    uniqueValuesFn(filteredData: Student[], facetedModel: Map<string, number>) {
      filteredData.forEach(({ repitencia }) => {
        const catRepitencias = repitencia.length
        facetedModel.set(
          `${catRepitencias}`,
          (facetedModel.get(`${catRepitencias}`) ?? 0) + 1,
        )
      })
    },
  },
}

export function getFiltersValues(searchParams: SearchParams) {
  const allFiltersValues: FiltersValues = {}
  const paramsKeys = Object.keys(searchParams) as Array<keyof SearchParams>
  paramsKeys.forEach((key) => {
    const formatFn =
      isKeyOfObject(key, FILTERS_FNS) && FILTERS_FNS[key].formatParam
    const formatedParam = formatFn ? formatFn(searchParams) : searchParams[key]
    if (
      (Array.isArray(formatedParam) && formatedParam.length) ||
      typeof formatedParam === 'string'
    )
      allFiltersValues[key] = formatedParam as string & string[] & number[]
  })
  return allFiltersValues
}


const formatArrValues = (
  param: string,
  validatingArr?: unknown[],
  sortingFn?: (a: string, b: string) => number,
) => {
  const paramValues = param.split('_')
  const filterValues = validatingArr
    ? paramValues.filter((value) => validatingArr.includes(value))
    : paramValues
  const sortedValues = sortingFn
    ? filterValues.sort(sortingFn)
    : filterValues.sort()

  return sortedValues
}

const formatCantValues = (
  param: string,
  minMaxValidation?: number[],
) => {
  const paramValues = param.split('_').map((value) => Number(value))
  let minValue = Math.min(...paramValues)
  let maxValue = Math.max(...paramValues)
  if (minMaxValidation) {
    const minValid = Math.min(...minMaxValidation)
    const maxValid = Math.max(...minMaxValidation)
    if (minValue < minValid) minValue = minValid
    if (maxValue > maxValid) maxValue = maxValid
  }
  return [minValue, maxValue]
}


export const getGrupalItemData = (
  valuesItem: string[],
  filterValue?: string[],
  uniqueValues?: Map<string, number>,
) => {
  const arraysAreEquals =
    JSON.stringify(valuesItem.toSorted()) ===
    JSON.stringify((filterValue || []).toSorted())
  const isSelected = valuesItem.length ? arraysAreEquals : undefined
  const quantity = getQuantity(valuesItem, uniqueValues)
  return { isSelected, quantity }
}


export const getQuantity = (
  value?: string | string[],
  uniqueValues?: Map<string, number>,
) => {
  if (!value) return undefined
  if (typeof value === 'string')
    return uniqueValues && (uniqueValues.get(value) ?? 0)
  return (
    uniqueValues &&
    value.reduce(
      (prevValue, newValue) => prevValue + (uniqueValues.get(newValue) ?? 0),
      0,
    )
  )
}
