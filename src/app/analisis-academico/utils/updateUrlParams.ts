export const updateParams = {
  cursos: (itemValue: string | string[], filterValue: string[]) => {
    let newState: string[]
    if (typeof itemValue === 'string') {
      newState = updateSingleValue(itemValue, filterValue)
    } else {
      const distintosAnios = [...new Set(itemValue.map((curso) => curso[0]))]
      const analyzedCursos =
        distintosAnios.length > 1
          ? filterValue
          : filterValue.filter((curso) => curso[0] === distintosAnios[0])
      newState =
        itemValue.every((curso) => filterValue.includes(curso)) &&
        analyzedCursos.length === itemValue.length
          ? filterValue.filter((prevCurso) => !itemValue.includes(prevCurso))
          : [
              ...new Set([
                ...filterValue.filter(
                  (curso) => !analyzedCursos.includes(curso),
                ),
                ...itemValue,
              ]),
            ]
    }
    return newState
  },
}

const updateSingleValue = (itemValue: string, filterValue: string[]) => {
  const newState = filterValue.includes(itemValue)
    ? filterValue.filter((prevParam) => prevParam !== itemValue)
    : [...filterValue, itemValue]
  return newState
}
