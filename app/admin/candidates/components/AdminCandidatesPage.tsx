'use client'
import PortalPanel from '@shared/layouts/PortalPanel'
import AdminWrapper from 'app/admin/shared/AdminWrapper'
import AdminCandidatesTable from './AdminCandidatesTable'
import { Campaign } from 'helpers/types'

interface AdminCandidatesPageProps {
  pathname: string
  title: string
  campaigns?: Campaign[]
}

export default function AdminCandidatesPage(
  props: AdminCandidatesPageProps,
): React.JSX.Element {
  const { pathname, title, campaigns } = props
  return (
    <AdminWrapper pathname={pathname} title={title}>
      <PortalPanel color="#2CCDB0">
        <AdminCandidatesTable campaigns={campaigns as []} />
      </PortalPanel>
    </AdminWrapper>
  )
}
