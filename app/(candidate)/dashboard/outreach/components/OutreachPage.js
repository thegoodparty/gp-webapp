import React from 'react'
import DashboardLayout from '../../shared/DashboardLayout'

export default function OutreachPage({ campaign }) {
  return (
    <DashboardLayout campaign={campaign}>
      <div>
        <h1>Outreach Page</h1>
        <p>Manage your outreach activities here.</p>
      </div>
    </DashboardLayout>
  )
} 