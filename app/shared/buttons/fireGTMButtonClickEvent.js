export const fireGTMButtonClickEvent = (target) => {
  window.dataLayer?.push({
    event: 'buttonClick',
    formId: target.id,
  });
};
