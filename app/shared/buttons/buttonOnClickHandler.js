import { fireGTMButtonClickEvent } from '@shared/buttons/fireGTMButtonClickEvent'

export const buttonOnClickHandler = (onClick) => (e) => {
  fireGTMButtonClickEvent(e.currentTarget)
  if (onClick) {
    return onClick(e)
  }
}
