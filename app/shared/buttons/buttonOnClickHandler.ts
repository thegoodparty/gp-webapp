import { fireGTMButtonClickEvent } from '@shared/buttons/fireGTMButtonClickEvent'
import { MouseEvent } from 'react'

export const buttonOnClickHandler =
  (onClick?: (e: MouseEvent<HTMLButtonElement>) => void) =>
  (e: MouseEvent<HTMLButtonElement>): void => {
    fireGTMButtonClickEvent(e.currentTarget)
    if (onClick) {
      onClick(e)
    }
  }
