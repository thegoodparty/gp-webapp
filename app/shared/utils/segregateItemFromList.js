export const segregateItemFromList = (
  items,
  segregator = (_item) => {
    return true;
  },
) =>
  items.reduce(
    ([found, rest], item) => {
      return segregator(item) ? [item, rest] : [found, [...rest, item]];
    },
    [null, []],
  );
