'use client'
import PortalPanel from '@shared/layouts/PortalPanel'
import AdminWrapper from 'app/admin/shared/AdminWrapper'
import React from 'react'
import TopIssuesList from './TopIssuesList'
import { TopIssuesProvider } from './UseTopIssuesContext'
import { TopIssueCreator } from './TopIssueCreator'

interface TopIssue {
  id: number
  name: string
  positions?: { id: number; name: string }[]
}

interface AdminTopIssuesPageProps {
  topIssues?: TopIssue[]
  pathname: string
  title: string
}

const AdminTopIssuesPage = ({
  topIssues: initTopIssues = [],
  ...rest
}: AdminTopIssuesPageProps): React.JSX.Element => (
  <TopIssuesProvider initTopIssues={initTopIssues}>
    <AdminWrapper {...rest}>
      <PortalPanel color="#2CCDB0">
        <TopIssueCreator />
        <br />
        <br />
        <br />
        <TopIssuesList />
      </PortalPanel>
    </AdminWrapper>
  </TopIssuesProvider>
)

export default AdminTopIssuesPage
