export const dateColumnSort = (dateA, dateB) => {
  const a = dateA;
  const b = dateB;
  let errorA, errorB, aDate, bDate;

  try {
    aDate = new Date(a).getTime();
  } catch (e) {
    errorA = true;
  }
  try {
    bDate = new Date(b).getTime();
  } catch (e) {
    errorB = true;
  }
  if ((!a && !b) || (!aDate && !bDate) || (errorA && errorB)) {
    return 0;
  }
  if (!a || a == '' || !aDate || errorA) {
    return -1;
  }
  if (!b || b == '' || !bDate || errorB) {
    return 1;
  }
  if (aDate < bDate) return -1;
  else if (aDate > bDate) return 1;
  else return 0;
};
