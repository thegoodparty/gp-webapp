export const fireGTMButtonClickEvent = (target = {}) => {
  target?.id &&
    window.dataLayer?.push({
      event: 'buttonClick',
      formId: target.id,
    })
}
