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
