import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Student } from './definitions'
import { SearchParams } from '@/app/analisis-academico/page'
import { getStudentsUniqueValues } from './data'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const capitalizeWords = (words: string) =>
  words
    .toLowerCase()
    .trim()
    .split(' ')
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ')

const defineRepitencia = (repitenciaArr: string[]): Student['repitencia'] =>
  repitenciaArr
    .filter((repValue) => !Number.isNaN(parseInt(repValue[0])))
    .map((value) => `${value[0]}° año`)
    .sort()

const formatDetalleMaterias = (detalle: string): string[] => {
  const partialString = (
    detalle.endsWith('.') ? detalle.slice(0, detalle.length - 1) : detalle
  ).replaceAll('º', '°')
  const splitedString =
    partialString.includes('Rep. Mediales, Comunicación y Lenguajes') ||
    partialString.includes('Arte, Tecnol. y Comunicación')
      ? partialString
          .split('), ')
          .map((string) => (string.endsWith(')') ? string : `${string})`))
      : partialString.split(', ')
  return splitedString.filter((value) => value !== 'No adeuda')
}

export function formatStudentsResponse(textResponse: string): Student[] {
  const [, ...data] = textResponse.split('\r\n').map((row) => row.split('\t'))
  return data.map(
    ([
      anioValue,
      divisionValue,
      apellidoValue,
      nombreValue,
      dniValue,
      troncalesCantValue,
      troncalesDetalleValue,
      generalesCantValue,
      generalesDetalleValue,
      enProceso2020CantidadValue,
      enProceso2020DetalleValue,
      repitencia1Value,
      repitencia2Value,
      repitencia3Value,
    ]) => {
      return {
        anio: anioValue.length ? `${anioValue[0]}º` : null,
        division: divisionValue.length ? `${divisionValue[0]}º` : null,
        apellido: apellidoValue.length
          ? capitalizeWords(apellidoValue)
              .trim()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
          : null,
        nombre: nombreValue.length
          ? capitalizeWords(nombreValue)
              .trim()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
          : null,
        dni: parseInt(dniValue) || null,
        repitencia: defineRepitencia([
          repitencia1Value,
          repitencia2Value,
          repitencia3Value,
        ]),
        cantTroncales: !Number.isNaN(parseInt(troncalesCantValue))
          ? parseInt(troncalesCantValue)
          : null,
        detalleTroncales: formatDetalleMaterias(troncalesDetalleValue.trim()),
        cantGenerales: !Number.isNaN(parseInt(generalesCantValue))
          ? parseInt(generalesCantValue)
          : null,
        detalleGenerales: formatDetalleMaterias(generalesDetalleValue.trim()),
        cantEnProceso2020: !Number.isNaN(parseInt(enProceso2020CantidadValue))
          ? parseInt(enProceso2020CantidadValue)
          : null,
        detalleEnProceso2020: formatDetalleMaterias(
          enProceso2020DetalleValue.trim(),
        ),
      }
    },
  )
}

export const FILTERS_FNS = {
  search: {
    filterFn: (student: Student, searchParams: SearchParams) => {
      const searchParam = searchParams.search || ''
      const filterValue = searchParam.split(' ').map((string) =>
        string
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, ''),
      )
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
    filterFn: (student: Student, searchParams: SearchParams) => {
      if (student.anio === null || student.division === null) return true
      const cursosParam = searchParams.cursos || ''
      const filterValue = cursosParam.split('_').sort()
      return filterValue.includes(`${student.anio[0]}° ${student.division[0]}°`)
    },
    uniqueValuesFn: (
      filteredData: Student[],
      facetedModel: Map<string, number>,
    ) => {
      filteredData.forEach((student) => {
        const value = `${student.anio?.[0]}° ${student.division?.[0]}°`
        facetedModel.set(value, (facetedModel.get(value) ?? 0) + 1)
      })
    },
  },
  materias: {
    filterFn: (student: Student, searchParams: SearchParams) => {
      const materiasParam = searchParams.materias || ''
      const enProceso2020Param = !(searchParams.enProceso2020 === 'false')
      const inclusionEstrictaParam = searchParams.inclusionEstricta === 'true'
      const filterValue = materiasParam.split('_')
      const studentMaterias = [
        ...student.detalleTroncales,
        ...student.detalleGenerales,
      ]
      if (enProceso2020Param)
        studentMaterias.push(...student.detalleEnProceso2020)
      return inclusionEstrictaParam
        ? filterValue.every((materia) => studentMaterias.includes(materia))
        : filterValue.some((materia) => studentMaterias.includes(materia))
    },
    uniqueValuesFn: (
      filteredData: Student[],
      facetedModel: Map<string, number>,
      filterParams: Omit<SearchParams, 'anio'>,
    ) => {
      filteredData.forEach((student) => {
        const values = [
          ...student.detalleTroncales,
          ...student.detalleGenerales,
        ]
        if (filterParams?.enProceso2020 !== 'false')
          values.push(...student.detalleEnProceso2020)
        values.forEach((value) =>
          facetedModel.set(value, (facetedModel.get(value) ?? 0) + 1),
        )
      })
    },
  },
  cantidades: {
    filterFn: (student: Student, searchParams: SearchParams) => {
      const {
        cantidadesTroncales,
        cantidadesGenerales,
        cantidadesEnProceso2020,
        enProceso2020,
      } = searchParams
      const criterioOptativo = searchParams.cantOptativo === 'true'
      const [troncalesValue, generalesValue, enProceso2020Value] = [
        cantidadesTroncales,
        cantidadesGenerales,
        cantidadesEnProceso2020,
      ].map(
        (filterParam) =>
          filterParam !== undefined &&
          filterParam
            .split('_')
            .map((value) => Number(value))
            .sort((a, b) => a - b),
      )

      const isTroncalesValid =
        troncalesValue && student.cantTroncales !== null
          ? student.cantTroncales >= troncalesValue[0] &&
            student.cantTroncales <= troncalesValue[1]
          : true
      const isGeneralesValid =
        generalesValue && student.cantGenerales !== null
          ? student.cantGenerales >= generalesValue[0] &&
            student.cantGenerales <= generalesValue[1]
          : true
      const isEnProceso2020Valid =
        enProceso2020Value &&
        enProceso2020 !== 'false' &&
        student.cantEnProceso2020 !== null
          ? student.cantEnProceso2020 >= enProceso2020Value[0] &&
            student.cantEnProceso2020 <= enProceso2020Value[1]
          : true

      return criterioOptativo
        ? isTroncalesValid || isGeneralesValid || isEnProceso2020Valid
        : isTroncalesValid && isGeneralesValid && isEnProceso2020Valid
    },
    uniqueValuesFn: (
      filteredData: Student[],
      facetedModel: Map<string, number>,
    ) => {
      filteredData.forEach((student) => {
        const { cantTroncales, cantGenerales, cantEnProceso2020 } = student
        facetedModel.set(
          `troncales_${cantTroncales}`,
          (facetedModel.get(`troncales_${cantTroncales}`) ?? 0) + 1,
        )
        facetedModel.set(
          `generales_${cantGenerales}`,
          (facetedModel.get(`generales_${cantGenerales}`) ?? 0) + 1,
        )
        facetedModel.set(
          `enProceso2020_${cantEnProceso2020}`,
          (facetedModel.get(`enProceso2020_${cantEnProceso2020}`) ?? 0) + 1,
        )
      })
    },
    getMinMaxCant: (data: Student[]) => {
      const uniqueValues = getStudentsUniqueValues(data, {}, 'cantidades')
      const troncalesUniqueValues = Array.from(uniqueValues.entries())
        .filter(([key]) => key.split('_')[0] === 'troncales')
        .map(([key]) => Number(key.split('_')[1]))
      const generalesUniqueValues = Array.from(uniqueValues.entries())
        .filter(([key]) => key.split('_')[0] === 'generales')
        .map(([key]) => Number(key.split('_')[1]))
      const enProceso2020UniqueValues = Array.from(uniqueValues.entries())
        .filter(([key]) => key.split('_')[0] === 'enProceso2020')
        .map(([key]) => Number(key.split('_')[1]))
      const troncalesMinMax = [
        Math.min(...troncalesUniqueValues),
        Math.max(...troncalesUniqueValues),
      ]
      const generalesMinMax = [
        Math.min(...generalesUniqueValues),
        Math.max(...generalesUniqueValues),
      ]
      const enProceso2020MinMax = [
        Math.min(...enProceso2020UniqueValues),
        Math.max(...enProceso2020UniqueValues),
      ]
      return { troncalesMinMax, generalesMinMax, enProceso2020MinMax }
    },
  },
  promocion: {
    filterFn: (student: Student, searchParams: SearchParams) => {
      const promocionParam = searchParams.promocion
      if (
        !promocionParam ||
        student.cantTroncales === null ||
        student.cantGenerales === null
      )
        return true
      if (promocionParam === 'solo promocionan')
        return (
          student.cantTroncales <= 2 &&
          student.cantTroncales + student.cantGenerales <= 4
        )
      return (
        student.cantTroncales > 2 ||
        student.cantTroncales + student.cantGenerales > 4
      )
    },
    uniqueValuesFn: (
      filteredData: Student[],
      facetedModel: Map<string, number>,
    ) => {
      filteredData.forEach((student) => {
        const value =
          student.cantTroncales === null || student.cantGenerales === null
            ? 'faltan datos'
            : student.cantTroncales <= 2 &&
                student.cantTroncales + student.cantGenerales <= 4
              ? 'Estudiantes que promocionan'
              : 'Estudiantes que permanecen'
        facetedModel.set(value, (facetedModel.get(value) ?? 0) + 1)
      })
    },
  },
  repitencia: {
    filterFn: (student: Student, searchParams: SearchParams) => {
      const studentRepitencia = student.repitencia
      const repitenciaAniosParam = searchParams.repitenciaAnios?.split('_')
      const repitenciaCantParam = searchParams.repitenciaCant
        ?.split('_')
        .map((value) => Number(value))
        .sort((a, b) => a - b)

      const isAniosOk = repitenciaAniosParam
        ? studentRepitencia.some((anioRepetido) =>
            repitenciaAniosParam.includes(anioRepetido),
          )
        : true
      const isCantOk = repitenciaCantParam
        ? studentRepitencia.length >= repitenciaCantParam[0] &&
          studentRepitencia.length <= repitenciaCantParam[1]
        : true

      return isAniosOk && isCantOk
    },
    uniqueValuesFn: (
      filteredData: Student[],
      facetedModel: Map<string, number>,
    ) => {
      filteredData.forEach(({ repitencia }) => {
        const aniosRepetidos = Array.from(new Set(repitencia))
        aniosRepetidos.forEach((anioRepetido) =>
          facetedModel.set(
            anioRepetido,
            (facetedModel.get(anioRepetido) ?? 0) + 1,
          ),
        )
        facetedModel.set(
          `cant_${repitencia.length}`,
          (facetedModel.get(`cant_${repitencia.length}`) ?? 0) + 1,
        )
      })
    },
    getMinMaxCant: (data: Student[]) => {
      const uniqueValues = getStudentsUniqueValues(data, {}, 'repitencia')
      const repitenciaCantUniqueValues = Array.from(uniqueValues.entries())
        .filter(([key]) => key.includes('cant'))
        .map(([key]) => Number(key.split('_')[1]))
      const repitenciaCantMinMax = [
        Math.min(...repitenciaCantUniqueValues),
        Math.max(...repitenciaCantUniqueValues),
      ]
      return repitenciaCantMinMax
    },
  },
} as const
