import {
  CURSOS,
  INTERPRETACION_CONDICIONES_ESPECIALES,
  MATERIAS_POR_CURSO,
} from './constants'
import { Student, StudentCalifActuales } from './definitions'
import { defineProyeccion, evaluarCalificacion } from './formatData'

export const projectCalifActuales = (
  students: Student[],
  califActuales: StudentCalifActuales[],
  instancia: keyof StudentCalifActuales['materias'][number] | 'acreditacion',
) => {
  console.time('Proyección de calif actuales')
  const ultimoAnio =
    Object.keys(CURSOS)
      .map((key) => Number(key[0]))
      .sort()
      .at(-1) || 0

  const projectedStudents = students.map((student) => {
    const { anio, division, dni } = student
    const califActual = califActuales.find(
      ({ dni: dniValue }) => dni === dniValue,
    )
    if (!califActual) {
      const error = {
        type: 'Error al obtener las calificaciones actuales del estudiante',
      }
      return {
        ...student,
        troncales: { ...student.troncales, error },
        generales: { ...student.generales, error },
      }
    }

    const dataCursos = (
      Object.keys(CURSOS) as Array<keyof typeof CURSOS>
    ).flatMap((key) => CURSOS[key])
    const anioValue = anio?.[0]
    const divisionValue = division?.[0]
    const orientacionCurso = dataCursos.find(
      ({ curso }) => curso === `${anioValue}° ${divisionValue}°`,
    )?.orientacion

    if (!orientacionCurso || !anioValue || !divisionValue) {
      const error = {
        type: 'Error al obtener información del curso del estudiante',
      }
      return {
        ...student,
        troncales: { ...student.troncales, error },
        generales: { ...student.generales, error },
      }
    }

    if (!Object.keys(MATERIAS_POR_CURSO).includes(`${anioValue}° año`)) {
      const error = {
        type: 'Error al obtener información de las materias del curso del estudiante',
      }
      return {
        ...student,
        troncales: { ...student.troncales, error },
        generales: { ...student.generales, error },
      }
    }

    const troncalesSet = new Set(student.troncales.detalle)
    const generalesSet = new Set(student.generales.detalle)
    const troncalesSinCalificar = new Set<string>([])
    const generalesSinCalificar = new Set<string>([])

    const materiasCurso =
      MATERIAS_POR_CURSO[`${anioValue}° año` as keyof typeof MATERIAS_POR_CURSO]

    materiasCurso.forEach(({ nombre, esTroncal, orientacion }) => {
      const isValidOrientacion =
        orientacion === orientacionCurso ||
        (orientacionCurso !== 'Ciclo Básico' &&
          orientacion === 'Ciclo Superior')
      if (!isValidOrientacion) return

      const formatedMateriaName = `${nombre} (${anioValue}°)`
      const calificacion =
        instancia !== 'acreditacion'
          ? califActual.materias.find(
              (calif) => calif.nombre.split('_')[0] === nombre,
            )?.[instancia]
          : undefined

      const evaluacion = evaluarCalificacion(calificacion)
      if (evaluacion === 'desaprueba')
        esTroncal
          ? troncalesSet.add(formatedMateriaName)
          : generalesSet.add(formatedMateriaName)
      if (evaluacion === 'sin calificar')
        esTroncal
          ? troncalesSinCalificar.add(formatedMateriaName)
          : generalesSinCalificar.add(formatedMateriaName)
    })

    const troncales = {
      cantidad: troncalesSet.size,
      detalle: [...troncalesSet],
      error:
        troncalesSinCalificar.size > 0
          ? {
              type: 'Materia/s troncal/es sin calificación',
              details: [...troncalesSinCalificar],
            }
          : undefined,
    }
    const generales = {
      cantidad: generalesSet.size,
      detalle: [...generalesSet],
      error:
        generalesSinCalificar.size > 0
          ? {
              type: 'Materia/s general/es sin calificación',
              details: [...generalesSinCalificar],
            }
          : undefined,
    }

    const analyzedStudent = {
      ...student,
      troncales,
      generales,
    }
    INTERPRETACION_CONDICIONES_ESPECIALES.forEach((mutatorFn) => mutatorFn(analyzedStudent))

    return {
      ...analyzedStudent,
      proyeccion: defineProyeccion(
        analyzedStudent.anio,
        ultimoAnio,
        analyzedStudent.troncales,
        analyzedStudent.generales,
        analyzedStudent.enProceso2020,
        true,
      ),
    }
  })
  console.timeEnd('Proyección de calif actuales')

  return projectedStudents
}
