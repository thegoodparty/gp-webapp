export const segregateItemFromList = <T>(
  items: T[],
  segregator: (item: T) => boolean = () => true,
): [T | null, T[]] =>
  items.reduce<[T | null, T[]]>(
    ([found, rest], item) =>
      segregator(item) ? [item, rest] : [found, [...rest, item]],
    [null, []],
  )

