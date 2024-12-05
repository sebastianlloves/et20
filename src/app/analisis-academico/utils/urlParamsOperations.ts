export const updateArrFilterState = (
  itemValue: string | string[],
  filterValues?: string[],
  partialAlterableArr?: string[],
  sortingFn?: (a: string, b: string) => number,
) => {
  const filterValue = filterValues || []
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
  const sortedNewState = sortingFn ? newState.sort(sortingFn) : newState.sort()
  return sortedNewState.length ? sortedNewState : undefined
}
