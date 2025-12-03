import { useContext } from 'react'
import { NavContext } from '@shared/layouts/navigation/NavigationProvider'

export const useNav = () => {
  const context = useContext(NavContext)
  if (!context) {
    throw new Error('useNav must be used within NavigationProvider')
  }
  return context
}



