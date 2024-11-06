import { StudentCalifActuales } from './definitions'
import { isCursosKey } from './typeGuards'

export const ANIO_ACTUAL = 2024

export const AGENDA_ANIO_ACTUAL: {
  // eslint-disable-next-line no-unused-vars
  [key in keyof StudentCalifActuales['materias'][number] | 'acreditacion']?: {
    fechaCierre: { dia: number; mes: number; anio: number }
    fechaInicioCarga: { dia: number; mes: number; anio: number }
  }
} = {
  primerBimestre: {
    fechaCierre: { dia: 31, mes: 5, anio: 2024 },
    fechaInicioCarga: { dia: 31, mes: 5, anio: 2024 },
  },
  segundoBimestre: {
    fechaCierre: { dia: 15, mes: 7, anio: 2024 },
    fechaInicioCarga: { dia: 15, mes: 7, anio: 2024 },
  },
  tercerBimestre: {
    fechaCierre: { dia: 30, mes: 9, anio: 2024 },
    fechaInicioCarga: { dia: 30, mes: 9, anio: 2024 },
  },
  cuartoBimestre: {
    fechaCierre: { dia: 30, mes: 11, anio: 2024 },
    fechaInicioCarga: { dia: 30, mes: 11, anio: 2024 },
  },
  primerCuatrimestre: {
    fechaCierre: { dia: 15, mes: 7, anio: 2024 },
    fechaInicioCarga: { dia: 15, mes: 7, anio: 2024 },
  },
  segundoCuatrimestre: {
    fechaCierre: { dia: 30, mes: 11, anio: 2024 },
    fechaInicioCarga: { dia: 30, mes: 11, anio: 2024 },
  },
  anual: {
    fechaCierre: { dia: 30, mes: 11, anio: 2024 },
    fechaInicioCarga: { dia: 30, mes: 11, anio: 2024 },
  },
  acreditacion: {
    fechaCierre: { dia: 28, mes: 2, anio: 2025 },
    fechaInicioCarga: { dia: 30, mes: 11, anio: 2024 },
  },
}

export const CURSOS = {
  '1° año': [
    { curso: '1° 1°', orientacion: 'Ciclo Básico', turno: 'Mañana' },
    { curso: '1° 2°', orientacion: 'Ciclo Básico', turno: 'Mañana' },
    { curso: '1° 3°', orientacion: 'Ciclo Básico', turno: 'Mañana' },
    { curso: '1° 4°', orientacion: 'Ciclo Básico', turno: 'Tarde' },
    { curso: '1° 5°', orientacion: 'Ciclo Básico', turno: 'Tarde' },
    { curso: '1° 6°', orientacion: 'Ciclo Básico', turno: 'Tarde' },
  ],
  '2° año': [
    { curso: '2° 1°', orientacion: 'Ciclo Básico', turno: 'Mañana' },
    { curso: '2° 2°', orientacion: 'Ciclo Básico', turno: 'Mañana' },
    { curso: '2° 3°', orientacion: 'Ciclo Básico', turno: 'Mañana' },
    { curso: '2° 4°', orientacion: 'Ciclo Básico', turno: 'Tarde' },
    { curso: '2° 5°', orientacion: 'Ciclo Básico', turno: 'Tarde' },
    { curso: '2° 6°', orientacion: 'Ciclo Básico', turno: 'Tarde' },
  ],
  '3° año': [
    { curso: '3° 1°', orientacion: 'Producción Multimedial', turno: 'Mañana' },
    { curso: '3° 2°', orientacion: 'TICs', turno: 'Mañana' },
    { curso: '3° 3°', orientacion: 'TICs', turno: 'Mañana' },
    { curso: '3° 4°', orientacion: 'Producción Multimedial', turno: 'Tarde' },
    { curso: '3° 5°', orientacion: 'Producción Multimedial', turno: 'Tarde' },
    { curso: '3° 6°', orientacion: 'TICs', turno: 'Tarde' },
  ],
  '4° año': [
    { curso: '4° 1°', orientacion: 'Producción Multimedial', turno: 'Mañana' },
    { curso: '4° 2°', orientacion: 'TICs', turno: 'Mañana' },
    { curso: '4° 3°', orientacion: 'Producción Multimedial', turno: 'Tarde' },
    { curso: '4° 4°', orientacion: 'TICs', turno: 'Tarde' },
  ],
  '5° año': [
    { curso: '5° 1°', orientacion: 'Producción Multimedial', turno: 'Mañana' },
    { curso: '5° 2°', orientacion: 'TICs', turno: 'Mañana' },
    { curso: '5° 3°', orientacion: 'Producción Multimedial', turno: 'Tarde' },
    { curso: '5° 4°', orientacion: 'TICs', turno: 'Tarde' },
  ],
  '6° año': [
    { curso: '6° 1°', orientacion: 'Producción Multimedial', turno: 'Mañana' },
    { curso: '6° 2°', orientacion: 'TICs', turno: 'Mañana' },
  ],
}

export const MATERIAS_POR_CURSO = {
  '1° año': [
    {
      nombre: 'Lengua y Literatura',
      esTroncal: true,
      orientacion: 'Ciclo Básico',
    },
    { nombre: 'Inglés', esTroncal: false, orientacion: 'Ciclo Básico' },
    { nombre: 'Historia', esTroncal: false, orientacion: 'Ciclo Básico' },
    { nombre: 'Geografía', esTroncal: false, orientacion: 'Ciclo Básico' },
    {
      nombre: 'Educación Ciudadana',
      esTroncal: false,
      orientacion: 'Ciclo Básico',
    },
    {
      nombre: 'Educación Física',
      esTroncal: false,
      orientacion: 'Ciclo Básico',
    },
    { nombre: 'Biología', esTroncal: false, orientacion: 'Ciclo Básico' },
    {
      nombre: 'Educación Artística',
      esTroncal: false,
      orientacion: 'Ciclo Básico',
    },
    { nombre: 'Matemática', esTroncal: true, orientacion: 'Ciclo Básico' },
    {
      nombre: 'Tecnol. de la Representación',
      esTroncal: true,
      orientacion: 'Ciclo Básico',
    },
    { nombre: 'Taller', esTroncal: true, orientacion: 'Ciclo Básico' },
  ],
  '2° año': [
    {
      nombre: 'Lengua y Literatura',
      esTroncal: true,
      orientacion: 'Ciclo Básico',
    },
    { nombre: 'Inglés', esTroncal: false, orientacion: 'Ciclo Básico' },
    { nombre: 'Historia', esTroncal: false, orientacion: 'Ciclo Básico' },
    { nombre: 'Geografía', esTroncal: false, orientacion: 'Ciclo Básico' },
    {
      nombre: 'Educación Ciudadana',
      esTroncal: false,
      orientacion: 'Ciclo Básico',
    },
    {
      nombre: 'Educación Física',
      esTroncal: false,
      orientacion: 'Ciclo Básico',
    },
    { nombre: 'Biología', esTroncal: false, orientacion: 'Ciclo Básico' },
    { nombre: 'Matemática', esTroncal: true, orientacion: 'Ciclo Básico' },
    { nombre: 'Física', esTroncal: true, orientacion: 'Ciclo Básico' },
    {
      nombre: 'Tecnol. de la Representación',
      esTroncal: false,
      orientacion: 'Ciclo Básico',
    },
    { nombre: 'Taller', esTroncal: true, orientacion: 'Ciclo Básico' },
  ],
  '3° año': [
    { nombre: 'Historia', esTroncal: false, orientacion: 'Ciclo Superior' },
    { nombre: 'Geografía', esTroncal: false, orientacion: 'Ciclo Superior' },
    {
      nombre: 'Educación Física',
      esTroncal: false,
      orientacion: 'Ciclo Superior',
    },
    {
      nombre: 'Educación Ciudadana',
      esTroncal: false,
      orientacion: 'Ciclo Superior',
    },
    { nombre: 'Inglés', esTroncal: false, orientacion: 'Ciclo Superior' },
    {
      nombre: 'Lengua y Literatura',
      esTroncal: true,
      orientacion: 'Ciclo Superior',
    },
    { nombre: 'Matemática', esTroncal: true, orientacion: 'Ciclo Superior' },
    { nombre: 'Física', esTroncal: true, orientacion: 'Ciclo Superior' },
    {
      nombre: 'Tecnol. de la Representación',
      esTroncal: true,
      orientacion: 'TICs',
    },
    {
      nombre: 'Rep. Mediales, Comunicación y Lenguajes',
      esTroncal: true,
      orientacion: 'Producción Multimedial',
    },
    { nombre: 'Química', esTroncal: false, orientacion: 'Ciclo Superior' },
    {
      nombre: 'Taller de Tecnol. y del Control',
      esTroncal: true,
      orientacion: 'Ciclo Superior',
    },
    { nombre: 'Taller de TICs', esTroncal: true, orientacion: 'TICs' },
    {
      nombre: 'Taller de Prod. Multimedial',
      esTroncal: true,
      orientacion: 'Producción Multimedial',
    },
  ],
  '4° año': [
    {
      nombre: 'Educación Física',
      esTroncal: false,
      orientacion: 'Ciclo Superior',
    },
    { nombre: 'Inglés', esTroncal: false, orientacion: 'Ciclo Superior' },
    {
      nombre: 'Ciudadanía y Trabajo',
      esTroncal: false,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Lengua y Literatura',
      esTroncal: false,
      orientacion: 'Ciclo Superior',
    },
    {
      nombre: 'Ciencia y Tecnología',
      esTroncal: false,
      orientacion: 'Ciclo Superior',
    },
    { nombre: 'Matemática', esTroncal: true, orientacion: 'Ciclo Superior' },
    {
      nombre: 'Introd. a las Redes de Comunicación',
      esTroncal: true,
      orientacion: 'TICs',
    },
    {
      nombre: 'Dispositivos Electrónicos Programables',
      esTroncal: false,
      orientacion: 'TICs',
    },
    {
      nombre: 'Lab. de Soporte de Equipos Informáticos',
      esTroncal: true,
      orientacion: 'TICs',
    },
    {
      nombre: 'Lab. de Desarrollo de Aplicaciones',
      esTroncal: true,
      orientacion: 'TICs',
    },
    {
      nombre: 'Taller de Proy. Integradores I',
      esTroncal: true,
      orientacion: 'TICs',
    },
    {
      nombre: 'Representación Sonora',
      esTroncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Representación Visual',
      esTroncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Diseño Web',
      esTroncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Lab. de Postprod. de la Imagen y del Sonido',
      esTroncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Taller de Tecnol. de la Imagen',
      esTroncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Taller de Tecnol. del Sonido',
      esTroncal: true,
      orientacion: 'Producción Multimedial',
    },
  ],
  '5° año': [
    {
      nombre: 'Educación Física',
      esTroncal: false,
      orientacion: 'Ciclo Superior',
    },
    { nombre: 'Inglés', esTroncal: false, orientacion: 'Ciclo Superior' },
    {
      nombre: 'Lengua y Literatura',
      esTroncal: false,
      orientacion: 'Ciclo Superior',
    },
    { nombre: 'Matemática', esTroncal: false, orientacion: 'Ciclo Superior' },
    {
      nombre: 'Administración de Redes',
      esTroncal: true,
      orientacion: 'TICs',
    },
    {
      nombre: 'Sist. Integrales de Información',
      esTroncal: true,
      orientacion: 'TICs',
    },
    {
      nombre: 'Lab. de Soporte de Sist. Informáticos',
      esTroncal: true,
      orientacion: 'TICs',
    },
    {
      nombre: 'Lab. de Desarrollo de Sist. de Información',
      esTroncal: true,
      orientacion: 'TICs',
    },
    {
      nombre: 'Taller de Proy. Integradores II',
      esTroncal: true,
      orientacion: 'TICs',
    },
    {
      nombre: 'Arte, Tecnol. y Comunicación',
      esTroncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Guión y Narrativa',
      esTroncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Lab. de Técnicas de Animación',
      esTroncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Lab. de Proy. Multimediales',
      esTroncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Taller de Proy. Audiovisual de Ficción',
      esTroncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Taller de Proy. Audiovisual Documental',
      esTroncal: true,
      orientacion: 'Producción Multimedial',
    },
  ],
  '6° año': [
    {
      nombre: 'Educación Física',
      esTroncal: false,
      orientacion: 'Ciclo Superior',
    },
    { nombre: 'Ciudadanía y Trabajo', esTroncal: false, orientacion: 'TICs' },
    {
      nombre: 'Gestión de los Procesos Productivos',
      esTroncal: true,
      orientacion: 'Ciclo Superior',
    },
    {
      nombre: 'Economía y Gestión de las Organizaciones',
      esTroncal: false,
      orientacion: 'Ciclo Superior',
    },
    {
      nombre: 'Admin. Avanzada de Sistemas y Redes',
      esTroncal: true,
      orientacion: 'TICs',
    },
    {
      nombre: 'Procesamiento de la Información',
      esTroncal: true,
      orientacion: 'TICs',
    },
    {
      nombre: 'Seguridad y Medioambiente',
      esTroncal: false,
      orientacion: 'TICs',
    },
    {
      nombre: 'Gestión y Marketing Aplicado a TICs',
      esTroncal: false,
      orientacion: 'TICs',
    },
    {
      nombre: 'Taller de Proy. Integradores III',
      esTroncal: true,
      orientacion: 'TICs',
    },
    {
      nombre: 'Arte Digital',
      esTroncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Lab. de Proy. Multimedial Ludificado',
      esTroncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Lab. de Proy. de Tecnol. y Artes Electrónicas',
      esTroncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Taller de Proy. Audio Visual Digital',
      esTroncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Taller de Animación 3D',
      esTroncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Prácticas Profesionalizantes',
      esTroncal: true,
      orientacion: 'Ciclo Superior',
    },
  ],
}

export const CURSOS_POR_ANIO = (() => {
  return Object.fromEntries(
    Object.keys(CURSOS)
      .filter((key) => isCursosKey(key))
      .map((anio) => [anio, CURSOS[anio].map((objCurso) => objCurso.curso)]),
  )
})()

export const DB_CALIFICACIONES: {
  [key: string]: {
    historico: {
      url: string
      tags: string[]
    }
    calificacionesEnCurso?: {
      [key: string]: {
        url: string
        tags: string[]
      }
    }
  }
} = {
  '2024': {
    historico: {
      url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRFM0_HRdLzWPQjgMU7_6dUfm6LWNYyQAckFT-EKb6aCAgwvUzZZsCTr8KS_Legk1_2Fe1U00tF-gWA/pub?gid=0&single=true&output=tsv',
      tags: ['dbHistorico2024'],
    },
    calificacionesEnCurso: {
      '1° año': {
        url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTPaEYIoQsDMJpM5X2Cm1thaN3GGnVyGtywuHKuKi2_Vd7DKgRplNjh5XbvfwIPXy4k7nAiPfeiurSw/pub?gid=0&single=true&output=tsv',
        tags: [
          'califActuales_1-1_2024',
          'califActuales_1-2_2024',
          'califActuales_1-3_2024',
          'califActuales_1-4_2024',
          'califActuales_1-5_2024',
          'califActuales_1-6_2024',
        ],
      },
      '2° año': {
        url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTPaEYIoQsDMJpM5X2Cm1thaN3GGnVyGtywuHKuKi2_Vd7DKgRplNjh5XbvfwIPXy4k7nAiPfeiurSw/pub?gid=1699780358&single=true&output=tsv',
        tags: [
          'califActuales_2-1_2024',
          'califActuales_2-2_2024',
          'califActuales_2-3_2024',
          'califActuales_2-4_2024',
          'califActuales_2-5_2024',
          'califActuales_2-6_2024',
        ],
      },
      '3° año_TICS': {
        url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTPaEYIoQsDMJpM5X2Cm1thaN3GGnVyGtywuHKuKi2_Vd7DKgRplNjh5XbvfwIPXy4k7nAiPfeiurSw/pub?gid=202943222&single=true&output=tsv',
        tags: [
          'califActuales_3-2_2024',
          'califActuales_3-3_2024',
          'califActuales_3-6_2024',
        ],
      },
      '3° año_MULTIMEDIA': {
        url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTPaEYIoQsDMJpM5X2Cm1thaN3GGnVyGtywuHKuKi2_Vd7DKgRplNjh5XbvfwIPXy4k7nAiPfeiurSw/pub?gid=1989201134&single=true&output=tsv',
        tags: [
          'califActuales_3-1_2024',
          'califActuales_3-4_2024',
          'califActuales_3-5_2024',
        ],
      },
      '4° año_TICS': {
        url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTPaEYIoQsDMJpM5X2Cm1thaN3GGnVyGtywuHKuKi2_Vd7DKgRplNjh5XbvfwIPXy4k7nAiPfeiurSw/pub?gid=2056764536&single=true&output=tsv',
        tags: ['califActuales_4-2_2024', 'califActuales_4-4_2024'],
      },
      '4° año_MULTIMEDIA': {
        url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTPaEYIoQsDMJpM5X2Cm1thaN3GGnVyGtywuHKuKi2_Vd7DKgRplNjh5XbvfwIPXy4k7nAiPfeiurSw/pub?gid=1517146940&single=true&output=tsv',
        tags: ['califActuales_4-1_2024', 'califActuales_4-3_2024'],
      },
      '5° año_TICS': {
        url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTPaEYIoQsDMJpM5X2Cm1thaN3GGnVyGtywuHKuKi2_Vd7DKgRplNjh5XbvfwIPXy4k7nAiPfeiurSw/pub?gid=140249657&single=true&output=tsv',
        tags: ['califActuales_5-2_2024', 'califActuales_5-4_2024'],
      },
      '5° año_MULTIMEDIA': {
        url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTPaEYIoQsDMJpM5X2Cm1thaN3GGnVyGtywuHKuKi2_Vd7DKgRplNjh5XbvfwIPXy4k7nAiPfeiurSw/pub?gid=2005552135&single=true&output=tsv',
        tags: ['califActuales_5-1_2024', 'califActuales_5-3_2024'],
      },
      '6° año_TICS': {
        url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTPaEYIoQsDMJpM5X2Cm1thaN3GGnVyGtywuHKuKi2_Vd7DKgRplNjh5XbvfwIPXy4k7nAiPfeiurSw/pub?gid=677971158&single=true&output=tsv',
        tags: ['califActuales_6-2_2024'],
      },
      '6° año_MULTIMEDIA': {
        url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTPaEYIoQsDMJpM5X2Cm1thaN3GGnVyGtywuHKuKi2_Vd7DKgRplNjh5XbvfwIPXy4k7nAiPfeiurSw/pub?gid=1992535574&single=true&output=tsv',
        tags: ['califActuales_6-1_2024'],
      },
    },
  },
  '2023': {
    historico: {
      url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQgBxzIjsnEVhDh_odQ2W3tVJXfp2rVxE0EgqUSjaauXkyeauSv-BrhjSZHCOqjNO5TCiSQoFxMRrSZ/pub?output=tsv',
      tags: ['dbHistorico2023'],
    },
  },
}

export const CALIFICACIONES_STRINGS = {
  desaprueba: ['En Proceso', 'Adeuda'],
  aprueba: ['Suficiente', 'Avanzado'],
}

export const INSTANCIAS_ANIO = [
  'primerBimestre',
  'segundoBimestre',
  'tercerBimestre',
  'cuartoBimestre',
  'primerCuatrimestre',
  'segundoCuatrimestre',
  'anual',
  'diciembre',
  'febrero',
  'definitiva',
] as const

export const CARACTER_GRADO = '°'
