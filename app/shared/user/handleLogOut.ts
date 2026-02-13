import { deleteUserCookies } from 'helpers/cookieHelper'
import { fireGTMButtonClickEvent } from '@shared/buttons/fireGTMButtonClickEvent'
import { clientFetch } from 'gpApi/clientFetch'
import { apiRoutes } from 'gpApi/routes'
import { MouseEvent } from 'react'

export const handleLogOut = async (
  e?: MouseEvent<HTMLElement>,
): Promise<void> => {
  deleteUserCookies()
  e?.currentTarget && fireGTMButtonClickEvent(e.currentTarget)
  await clientFetch(apiRoutes.authentication.logout)
  window.location.replace('/')
}
