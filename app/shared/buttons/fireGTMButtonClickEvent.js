export const fireGTMButtonClickEvent = (target) => {
  window.dataLayer?.push({
    event: 'buttonClick',
    formId: target.id,
  });
  console.log(`window.dataLayer =>`, window?.dataLayer)
};
