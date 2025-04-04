import BlackButton from '@shared/buttons/BlackButton'
import PortalPanel from '@shared/layouts/PortalPanel'
import Link from 'next/link'
import { leftMenuItems } from '../shared/AdminLeftMenu'
import AdminWrapper from '../shared/AdminWrapper'

export default function AdminPage(props) {
  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <div className="grid grid-cols-12 gap-6">
          {leftMenuItems.map((item) => (
            <div className="col-span-12 md:col-span-6" key={item.label}>
              <Link href={item.link}>
                <BlackButton style={{ width: '100%' }}>
                  <div className="font-black">{item.label}</div>
                </BlackButton>
              </Link>
            </div>
          ))}
        </div>
      </PortalPanel>
    </AdminWrapper>
  )
}
