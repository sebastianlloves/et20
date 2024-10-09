import { isCursosKey } from './typeGuards'

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
      es_troncal: true,
      orientacion: 'Ciclo Básico',
    },
    { nombre: 'Inglés', es_troncal: false, orientacion: 'Ciclo Básico' },
    { nombre: 'Historia', es_troncal: false, orientacion: 'Ciclo Básico' },
    { nombre: 'Geografía', es_troncal: false, orientacion: 'Ciclo Básico' },
    {
      nombre: 'Educación Ciudadana',
      es_troncal: false,
      orientacion: 'Ciclo Básico',
    },
    {
      nombre: 'Educación Física',
      es_troncal: false,
      orientacion: 'Ciclo Básico',
    },
    { nombre: 'Biología', es_troncal: false, orientacion: 'Ciclo Básico' },
    {
      nombre: 'Educación Artística',
      es_troncal: false,
      orientacion: 'Ciclo Básico',
    },
    { nombre: 'Matemática', es_troncal: true, orientacion: 'Ciclo Básico' },
    {
      nombre: 'Tecnol. de la Representación',
      es_troncal: true,
      orientacion: 'Ciclo Básico',
    },
    { nombre: 'Taller', es_troncal: true, orientacion: 'Ciclo Básico' },
  ],
  '2° año': [
    {
      nombre: 'Lengua y Literatura',
      es_troncal: true,
      orientacion: 'Ciclo Básico',
    },
    { nombre: 'Inglés', es_troncal: false, orientacion: 'Ciclo Básico' },
    { nombre: 'Historia', es_troncal: false, orientacion: 'Ciclo Básico' },
    { nombre: 'Geografía', es_troncal: false, orientacion: 'Ciclo Básico' },
    {
      nombre: 'Educación Ciudadana',
      es_troncal: false,
      orientacion: 'Ciclo Básico',
    },
    {
      nombre: 'Educación Física',
      es_troncal: false,
      orientacion: 'Ciclo Básico',
    },
    { nombre: 'Biología', es_troncal: false, orientacion: 'Ciclo Básico' },
    { nombre: 'Matemática', es_troncal: true, orientacion: 'Ciclo Básico' },
    { nombre: 'Física', es_troncal: true, orientacion: 'Ciclo Básico' },
    {
      nombre: 'Tecnol. de la Representación',
      es_troncal: false,
      orientacion: 'Ciclo Básico',
    },
    { nombre: 'Taller', es_troncal: true, orientacion: 'Ciclo Básico' },
  ],
  '3° año': [
    { nombre: 'Historia', es_troncal: false, orientacion: 'Ciclo Superior' },
    { nombre: 'Geografía', es_troncal: false, orientacion: 'Ciclo Superior' },
    {
      nombre: 'Educación Física',
      es_troncal: false,
      orientacion: 'Ciclo Superior',
    },
    {
      nombre: 'Educación Ciudadana',
      es_troncal: false,
      orientacion: 'Ciclo Superior',
    },
    { nombre: 'Inglés', es_troncal: false, orientacion: 'Ciclo Superior' },
    {
      nombre: 'Lengua y Literatura',
      es_troncal: true,
      orientacion: 'Ciclo Superior',
    },
    { nombre: 'Matemática', es_troncal: true, orientacion: 'Ciclo Superior' },
    { nombre: 'Física', es_troncal: true, orientacion: 'Ciclo Superior' },
    {
      nombre: 'Tecnol. de la Representación',
      es_troncal: true,
      orientacion: 'TICs',
    },
    {
      nombre: 'Rep. Mediales, Comunicación y Lenguajes',
      es_troncal: true,
      orientacion: 'Producción Multimedial',
    },
    { nombre: 'Química', es_troncal: false, orientacion: 'Ciclo Superior' },
    {
      nombre: 'Taller de Tecnol. y del Control',
      es_troncal: true,
      orientacion: 'Ciclo Superior',
    },
    { nombre: 'Taller de TICs', es_troncal: true, orientacion: 'TICs' },
    {
      nombre: 'Taller de Prod. Multimedial',
      es_troncal: true,
      orientacion: 'Producción Multimedial',
    },
  ],
  '4° año': [
    {
      nombre: 'Educación Física',
      es_troncal: false,
      orientacion: 'Ciclo Superior',
    },
    { nombre: 'Inglés', es_troncal: false, orientacion: 'Ciclo Superior' },
    {
      nombre: 'Ciudadanía y Trabajo',
      es_troncal: false,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Lengua y Literatura',
      es_troncal: false,
      orientacion: 'Ciclo Superior',
    },
    {
      nombre: 'Ciencia y Tecnología',
      es_troncal: false,
      orientacion: 'Ciclo Superior',
    },
    { nombre: 'Matemática', es_troncal: true, orientacion: 'Ciclo Superior' },
    {
      nombre: 'Introd. a las Redes de Comunicación',
      es_troncal: true,
      orientacion: 'TICs',
    },
    {
      nombre: 'Dispositivos Electrónicos Programables',
      es_troncal: false,
      orientacion: 'TICs',
    },
    {
      nombre: 'Lab. de Soporte de Equipos Informáticos',
      es_troncal: true,
      orientacion: 'TICs',
    },
    {
      nombre: 'Lab. de Desarrollo de Aplicaciones',
      es_troncal: true,
      orientacion: 'TICs',
    },
    {
      nombre: 'Taller de Proy. Integradores I',
      es_troncal: true,
      orientacion: 'TICs',
    },
    {
      nombre: 'Representación Sonora',
      es_troncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Representación Visual',
      es_troncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Diseño Web',
      es_troncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Lab. de Postprod. de la Imagen y del Sonido',
      es_troncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Taller de Tecnol. de la Imagen',
      es_troncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Taller de Tecnol. del Sonido',
      es_troncal: true,
      orientacion: 'Producción Multimedial',
    },
  ],
  '5° año': [
    {
      nombre: 'Educación Física',
      es_troncal: false,
      orientacion: 'Ciclo Superior',
    },
    { nombre: 'Inglés', es_troncal: false, orientacion: 'Ciclo Superior' },
    {
      nombre: 'Lengua y Literatura',
      es_troncal: false,
      orientacion: 'Ciclo Superior',
    },
    { nombre: 'Matemática', es_troncal: false, orientacion: 'Ciclo Superior' },
    {
      nombre: 'Administración de Redes',
      es_troncal: true,
      orientacion: 'TICs',
    },
    {
      nombre: 'Sist. Integrales de Información',
      es_troncal: true,
      orientacion: 'TICs',
    },
    {
      nombre: 'Lab. de Soporte de Sist. Informáticos',
      es_troncal: true,
      orientacion: 'TICs',
    },
    {
      nombre: 'Lab. de Desarrollo de Sist. de Información',
      es_troncal: true,
      orientacion: 'TICs',
    },
    {
      nombre: 'Taller de Proy. Integradores II',
      es_troncal: true,
      orientacion: 'TICs',
    },
    {
      nombre: 'Arte, Tecnol. y Comunicación',
      es_troncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Guión y Narrativa',
      es_troncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Lab. de Técnicas de Animación',
      es_troncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Lab. de Proy. Multimediales',
      es_troncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Taller de Proy. Audiovisual de Ficción',
      es_troncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Taller de Proy. Audiovisual Documental',
      es_troncal: true,
      orientacion: 'Producción Multimedial',
    },
  ],
  '6° año': [
    {
      nombre: 'Educación Física',
      es_troncal: false,
      orientacion: 'Ciclo Superior',
    },
    { nombre: 'Ciudadanía y Trabajo', es_troncal: false, orientacion: 'TICs' },
    {
      nombre: 'Gestión de los Procesos Productivos',
      es_troncal: true,
      orientacion: 'Ciclo Superior',
    },
    {
      nombre: 'Economía y Gestión de las Organizaciones',
      es_troncal: false,
      orientacion: 'Ciclo Superior',
    },
    {
      nombre: 'Admin. Avanzada de Sistemas y Redes',
      es_troncal: true,
      orientacion: 'TICs',
    },
    {
      nombre: 'Procesamiento de la Información',
      es_troncal: true,
      orientacion: 'TICs',
    },
    {
      nombre: 'Seguridad y Medioambiente',
      es_troncal: false,
      orientacion: 'TICs',
    },
    {
      nombre: 'Gestión y Marketing Aplicado a TICs',
      es_troncal: false,
      orientacion: 'TICs',
    },
    {
      nombre: 'Taller de Proy. Integradores III',
      es_troncal: true,
      orientacion: 'TICs',
    },
    {
      nombre: 'Arte Digital',
      es_troncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Lab. de Proy. Multimedial Ludificado',
      es_troncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Lab. de Proy. de Tecnol. y Artes Electrónicas',
      es_troncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Taller de Proy. Audio Visual Digital',
      es_troncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Taller de Animación 3D',
      es_troncal: true,
      orientacion: 'Producción Multimedial',
    },
    {
      nombre: 'Prácticas Profesionalizantes',
      es_troncal: true,
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

export const DB_CALIFICACIONES_HISTORICO: {
  [key: string]: { url: string; tag: string }
} = {
  '2024': {
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRFM0_HRdLzWPQjgMU7_6dUfm6LWNYyQAckFT-EKb6aCAgwvUzZZsCTr8KS_Legk1_2Fe1U00tF-gWA/pub?gid=0&single=true&output=tsv',
    tag: 'dbHistorico2024',
  },
  '2023': {
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQgBxzIjsnEVhDh_odQ2W3tVJXfp2rVxE0EgqUSjaauXkyeauSv-BrhjSZHCOqjNO5TCiSQoFxMRrSZ/pub?gid=1642145925&single=true&output=tsv',
    tag: 'dbHistorico2023',
  },
}

export const DB_CALIFICACIONES_ACTUALES = {
  '1° año': {
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTPaEYIoQsDMJpM5X2Cm1thaN3GGnVyGtywuHKuKi2_Vd7DKgRplNjh5XbvfwIPXy4k7nAiPfeiurSw/pub?gid=0&single=true&output=tsv',
    tag: 'califActuales_1anio',
  },
}
