export const updateArrParamState = (
  itemValue: string | string[],
  filterValue: string[],
  partialAlterableArr?: string[],
  sortingFn?: (a: string, b: string) => number,
) => {
  let newState: string[]
  if (typeof itemValue === 'string') {
    const alreadyIsInFilter = filterValue.includes(itemValue)
    newState = alreadyIsInFilter
      ? filterValue.filter((prevValue) => prevValue !== itemValue)
      : [...filterValue, itemValue]
  } else if (!partialAlterableArr) {
    const itemIsSelected =
      itemValue.every((value) => filterValue.includes(value)) &&
      itemValue.length === filterValue.length
    newState = itemIsSelected ? [] : itemValue
  } else {
    const unalterablePartialArr = filterValue.filter(
      (value) => !partialAlterableArr.includes(value),
    )
    const modifiablePartialArr = filterValue.filter((value) =>
      partialAlterableArr.includes(value),
    )
    const alreadyIsInFilter =
      itemValue.every((value) => modifiablePartialArr.includes(value)) &&
      itemValue.length === modifiablePartialArr.length
    newState = alreadyIsInFilter
      ? filterValue.filter((value) => !itemValue.includes(value))
      : [...unalterablePartialArr, ...itemValue]
  }
  const sortedState = sortingFn ? newState.sort(sortingFn) : newState.sort()
  return sortedState.length ? sortedState.join('_') : undefined
}

export const getGrupalItemData = (
  valuesItem: string[],
  filterValue: string[],
  uniqueValues?: Map<string, number>,
) => {
  const arraysAreEquals =
    JSON.stringify(valuesItem.sort()) === JSON.stringify(filterValue.sort())
  const isSelected = valuesItem.length ? arraysAreEquals : undefined
  const quantity = getQuantity(valuesItem, uniqueValues)
  return { isSelected, quantity }
}

export const getQuantity = (
  value: string | string[],
  uniqueValues?: Map<string, number>,
) => {
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
