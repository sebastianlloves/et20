import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Calificacion, Student, StudentCalifActuales } from './definitions'
import { SearchParams } from '@/app/analisis-academico/page'
import { getStudentsUniqueValues } from './data'
import { CALIFICACIONES_STRINGS, INSTANCIAS_ANIO } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatStudentsResponse(
  textResponse: string,
  anioDB: number,
): Student[] {
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
      const anio = anioValue.length ? `${anioValue[0]}º` : null
      const repitencia = defineRepitencia([
        repitencia1Value,
        repitencia2Value,
        repitencia3Value,
      ])
      const curso202enSecundaria = anio
        ? anioDB + 1 - Number(anio[0]) - repitencia.length <= 2020
        : true
      return {
        anio,
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
        repitencia,
        troncales: {
          cantidad: !Number.isNaN(parseInt(troncalesCantValue))
            ? parseInt(troncalesCantValue)
            : null,
          detalle: formatDetalleMaterias(troncalesDetalleValue.trim()),
        },
        generales: {
          cantidad: !Number.isNaN(parseInt(generalesCantValue))
            ? parseInt(generalesCantValue)
            : null,
          detalle: formatDetalleMaterias(generalesDetalleValue.trim()),
        },
        enProceso2020: {
          cantidad: !Number.isNaN(parseInt(enProceso2020CantidadValue))
            ? parseInt(enProceso2020CantidadValue)
            : null,
          detalle: curso202enSecundaria
            ? formatDetalleMaterias(enProceso2020DetalleValue.trim())
            : 'No corresponde',
        },
      }
    },
  )
}

export function formatCalifActualesResponse(
  response: string,
  anio: string,
): Pick<StudentCalifActuales, 'dni' | 'materias'>[] {
  const [, encabezadoMaterias, , ...data] = response
    .split('\r\n')
    .map((row) => {
      const [, ...data] = row.split('\t')
      return data
    })
  const formatedDatada = data.flatMap((row) =>
    Array.from(row, (_, index) => {
      const arrIndex = index / 13
      if (Number.isInteger(arrIndex)) {
        const [
          apellido,
          nombre,
          dniValue,
          primerBimestreValue,
          segundoBimestreValue,
          primerCuatrimestreValue,
          tercerBimestreValue,
          cuartoBimestreValue,
          segundoCuatrimestreValue,
          anualValue,
          diciembreValue,
          febreroValue,
          definitivaValue,
        ] = row.slice(index, index + 13)
        return {
          apellido,
          nombre,
          dni: Number(dniValue),
          materia: `${encabezadoMaterias[index]}_${anio}`,
          primerBimestre: defineCalificacion(primerBimestreValue),
          segundoBimestre: defineCalificacion(segundoBimestreValue),
          primerCuatrimestre: defineCalificacion(primerCuatrimestreValue),
          tercerBimestre: defineCalificacion(tercerBimestreValue),
          cuartoBimestre: defineCalificacion(cuartoBimestreValue),
          segundoCuatrimestre: defineCalificacion(segundoCuatrimestreValue),
          anual: defineCalificacion(anualValue),
          diciembre: defineCalificacion(diciembreValue),
          febrero: defineCalificacion(febreroValue),
          definitiva: defineCalificacion(definitivaValue),
        }
      }
      return null
    }).filter((value) => value !== null),
  )

  const uniqueValuesDNI = new Set(formatedDatada.map(({ dni }) => dni))
  const groupedData = [...uniqueValuesDNI].map((uniqueDNI) => {
    const formatedObjs = formatedDatada.filter(({ dni }) => uniqueDNI === dni)
    const materias = formatedObjs.map(
      ({
        materia,
        primerBimestre,
        segundoBimestre,
        primerCuatrimestre,
        tercerBimestre,
        cuartoBimestre,
        segundoCuatrimestre,
        anual,
        diciembre,
        febrero,
        definitiva,
      }) => {
        return {
          nombre: materia,
          primerBimestre,
          segundoBimestre,
          primerCuatrimestre,
          tercerBimestre,
          cuartoBimestre,
          segundoCuatrimestre,
          anual,
          diciembre,
          febrero,
          definitiva,
        }
      },
    )
    return { dni: uniqueDNI, materias }
  })
  return groupedData
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
      _filteredData: Student[],
      _facetedModel: Map<string, number>,
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
        ...student.troncales.detalle,
        ...student.generales.detalle,
      ]
      if (
        enProceso2020Param &&
        student.enProceso2020.detalle !== 'No corresponde'
      )
        studentMaterias.push(...student.enProceso2020.detalle)
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
          ...student.troncales.detalle,
          ...student.generales.detalle,
        ]
        if (
          filterParams?.enProceso2020 !== 'false' &&
          student.enProceso2020.detalle !== 'No corresponde'
        )
          values.push(...student.enProceso2020.detalle)
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
        troncalesValue && student.troncales.cantidad !== null
          ? student.troncales.cantidad >= troncalesValue[0] &&
            student.troncales.cantidad <= troncalesValue[1]
          : true
      const isGeneralesValid =
        generalesValue && student.generales.cantidad !== null
          ? student.generales.cantidad >= generalesValue[0] &&
            student.generales.cantidad <= generalesValue[1]
          : true
      const isEnProceso2020Valid =
        enProceso2020Value &&
        enProceso2020 !== 'false' &&
        student.enProceso2020.cantidad !== null
          ? student.enProceso2020.cantidad >= enProceso2020Value[0] &&
            student.enProceso2020.cantidad <= enProceso2020Value[1]
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
        const {
          troncales: { cantidad: cantTroncales },
          generales: { cantidad: cantGenerales },
          enProceso2020: { cantidad: cantEnProceso2020 },
        } = student
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
        student.troncales.cantidad === null ||
        student.generales.cantidad === null
      )
        return true
      if (promocionParam === 'solo promocionan')
        return (
          student.troncales.cantidad <= 2 &&
          student.troncales.cantidad + student.generales.cantidad <= 4
        )
      return (
        student.troncales.cantidad > 2 ||
        student.troncales.cantidad + student.generales.cantidad > 4
      )
    },
    uniqueValuesFn: (
      filteredData: Student[],
      facetedModel: Map<string, number>,
    ) => {
      filteredData.forEach((student) => {
        const value =
          student.troncales.cantidad === null ||
          student.generales.cantidad === null
            ? 'faltan datos'
            : student.troncales.cantidad <= 2 &&
                student.troncales.cantidad + student.generales.cantidad <= 4
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

const defineCalificacion = (string: string) => {
  if (!Number.isNaN(parseInt(string))) {
    const numberCalif = Number(string)
    if (numberCalif > 0 && numberCalif <= 10) return numberCalif
  }
  const califStringsValidas = Object.values(CALIFICACIONES_STRINGS).flat()
  if (califStringsValidas.some((califString) => califString === string))
    return string
  return null
}

export const evaluarCalificacion = (calificacion?: Calificacion) => {
  if (CALIFICACIONES_STRINGS.desaprueba.some((value) => value === calificacion))
    return 'desaprueba'
  if (CALIFICACIONES_STRINGS.aprueba.some((value) => value === calificacion))
    return 'aprueba'
  if (Number(calificacion) > 0) {
    return Number(calificacion) >= 6 ? 'aprueba' : 'desaprueba'
  }
  return 'sin calificar'
}

export function isValidInstancia(
  instancia: string,
): instancia is (typeof INSTANCIAS_ANIO)[number] {
  return (
    instancia === 'acreditacion' ||
    INSTANCIAS_ANIO.includes(instancia as (typeof INSTANCIAS_ANIO)[number])
  )
}

export const getPagesNumbers = (currentPage: number, lastPage: number) => {
  const firstPage = 1
  const allPagesNumbers = Array.from(
    { length: lastPage },
    (_, index) => index + 1,
  )
  const cantConsecutiveNumbers = 1
  const fixedElements = 2
  const smallerPrevNumber = currentPage - cantConsecutiveNumbers
  const biggerNextNumber = currentPage + cantConsecutiveNumbers
  const bonusNextSpots =
    smallerPrevNumber - firstPage < fixedElements
      ? fixedElements - (smallerPrevNumber - firstPage)
      : 0
  const bonusPrevSpots =
    lastPage - biggerNextNumber <= fixedElements
      ? fixedElements - (lastPage - biggerNextNumber)
      : 0

  const setNumbers = new Set<number>()
  allPagesNumbers.forEach((pageNumber) => {
    const diferencia = pageNumber - currentPage
    if (
      pageNumber === firstPage ||
      pageNumber === lastPage ||
      (diferencia <= cantConsecutiveNumbers + bonusNextSpots &&
        diferencia >= -cantConsecutiveNumbers - bonusPrevSpots)
    )
      setNumbers.add(pageNumber)
  })
  const pagesButtons = Array.from([...setNumbers].sort((a, b) => a - b))
  
  return pagesButtons
}
