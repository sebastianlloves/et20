import { CURSOS } from "./constants"

export const isCursosKey = (anio: string): anio is keyof typeof CURSOS => {
  return CURSOS[anio as keyof typeof CURSOS] !== undefined
}
