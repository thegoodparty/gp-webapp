import { fireGTMButtonClickEvent } from '@shared/buttons/fireGTMButtonClickEvent'
import { MouseEvent } from 'react'

export const handleLogOut = (e?: MouseEvent<HTMLElement>): void => {
  e?.currentTarget && fireGTMButtonClickEvent(e.currentTarget)
  window.location.replace('/logout')
}
