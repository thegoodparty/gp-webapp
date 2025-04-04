'use client'
import PortalPanel from '@shared/layouts/PortalPanel'
import AdminWrapper from 'app/admin/shared/AdminWrapper'
import AdminCandidatesTable from './AdminCandidatesTable'

export default function AdminCandidatesPage(props) {
  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <AdminCandidatesTable {...props} />
      </PortalPanel>
    </AdminWrapper>
  )
}
