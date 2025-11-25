'use client'
import DashboardMenu from 'app/(candidate)/dashboard/shared/DashboardMenu'
import Hamburger from '@shared/utils/Hamburger'
import { useEffect } from 'react'

const disableScroll = () => {
  window.scrollTo(0, 0)
  window.onscroll = () => {
    window.scrollTo(0, 0)
  }
}

const enableScroll = () => {
  window.onscroll = () => {}
}

interface TopDashboardMenuProps {
  open: boolean
  toggleCallback: () => void
  pathname: string
}

const TopDashboardMenu = ({ open, toggleCallback, pathname }: TopDashboardMenuProps): React.JSX.Element => {
  useEffect(() => {
    if (open) {
      disableScroll()
    } else {
      enableScroll()
    }
  }, [open])

  return (
    <div className="lg:hidden">
      <Hamburger
        hideOutline={false}
        toggled={open}
        toggle={toggleCallback}
        size={20}
      />
      {open && (
        <div className="fixed top-14 left-0 w-screen h-[calc(100vh-56px)] bg-indigo-50 p-2 overflow-x-hidden overflow-y-auto">
          <DashboardMenu
            pathname={pathname}
            toggleCallback={toggleCallback}
            mobileMode={true}
          />
        </div>
      )}
    </div>
  )
}

export default TopDashboardMenu

