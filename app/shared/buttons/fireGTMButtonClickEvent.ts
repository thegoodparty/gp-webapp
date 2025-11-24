interface GTMEvent {
  event: string
  formId?: string
  'hs-form-guid'?: string
  'hs-form-name'?: string
}

declare global {
  interface Window {
    dataLayer?: GTMEvent[]
  }
}

interface TargetWithId {
  id?: string
}

export const fireGTMButtonClickEvent = (target: TargetWithId = {}): void => {
  target?.id &&
    window.dataLayer?.push({
      event: 'buttonClick',
      formId: target.id,
    })
}

