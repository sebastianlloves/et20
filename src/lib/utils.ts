import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Student } from './definitions'
import { SearchParams } from '@/app/analisis-academico/page'

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
    .map((value) => `${value[0]}º año`)
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
      const { cantTroncales, cantGenerales, cantEnProceso2020 } = student
      const {
        cantTroncales: troncalesParam,
        cantGenerales: generalesParam,
        cantEnProceso2020: enProceso2020Param,
        enProceso2020: showEnProcesoParam,
      } = searchParams
      const [troncalesValue, generalesValue, enProceso2020Value] = [
        troncalesParam,
        generalesParam,
        enProceso2020Param,
      ].map(
        (filterValue) =>
          filterValue !== undefined &&
          filterValue
            .split('_')
            .map((value) => Number(value))
            .sort((a, b) => a - b),
      )

      const isTroncalesValid =
        troncalesValue && cantTroncales
          ? cantTroncales >= troncalesValue[0] &&
            cantTroncales <= troncalesValue[1]
          : true
      const isGeneralesValid =
        generalesValue && cantGenerales
          ? cantGenerales >= generalesValue[0] &&
            cantGenerales <= generalesValue[1]
          : true
      const isEnProceso2020Valid =
        enProceso2020Value &&
        showEnProcesoParam !== 'false' &&
        cantEnProceso2020
          ? cantEnProceso2020 >= enProceso2020Value[0] &&
            cantEnProceso2020 <= enProceso2020Value[1]
          : true

      return isTroncalesValid && isGeneralesValid && isEnProceso2020Valid
      // return inclusionEstricta ? isTroncalesValid && isGeneralesValid && isEnProceso2020Valid : isTroncalesValid || isGeneralesValid || isEnProceso2020Valid
    },
    uniqueValuesFn: (
      filteredData: Student[],
      facetedModel: Map<string, number>,
    ) => undefined,
  },
  cantTroncales: {
    filterFn: (student: Student, searchParams: SearchParams) => {
      if (student.cantTroncales !== null && searchParams.cantTroncales) {
        const [minValue, maxValue] = searchParams.cantTroncales
          .split('_')
          .map((value) => Number(value))
        return (
          student.cantTroncales >= minValue && student.cantTroncales <= maxValue
        )
      }
      return true
    },
    uniqueValuesFn: (
      filteredData: Student[],
      facetedModel: Map<any, number>,
    ) => {
      filteredData.forEach((student) => {
        const value = student.cantTroncales
        facetedModel.set(value, (facetedModel.get(value) ?? 0) + 1)
      })
    },
  },
  cantGenerales: {
    filterFn: (student: Student, searchParams: SearchParams) => {
      if (student.cantGenerales !== null && searchParams.cantGenerales) {
        const [minValue, maxValue] = searchParams.cantGenerales
          .split('_')
          .map((value) => Number(value))
        return (
          student.cantGenerales >= minValue && student.cantGenerales <= maxValue
        )
      }
      return true
    },
    uniqueValuesFn: (
      filteredData: Student[],
      facetedModel: Map<any, number>,
    ) => {
      filteredData.forEach((student) => {
        const value = student.cantGenerales
        facetedModel.set(value, (facetedModel.get(value) ?? 0) + 1)
      })
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
} as const
