// TODO: this should be looking at the current set of aiContent keys and making
//  the determination based on that, not some arbitrary count w/ a limit of 100
export const getNewAiContentSectionKey = (sections, selected) => {
  if (!sections[selected]) {
    return selected;
  }
  for (let i = 2; i <= 100; i++) {
    if (!sections[`${selected}${i}`]) {
      return `${selected}${i}`;
    }
  }
  return `${selected}101`;
};
