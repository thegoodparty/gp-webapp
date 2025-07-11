'use client'
import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout'
import DomainForm from './DomainForm'
import { useState } from 'react'
import GreatSuccess from './GreatSuccess'

export default function DomainPage({ pathname, campaign }) {
  const [success, setSuccess] = useState(true)
  const handleSuccess = () => setSuccess(true)
  return (
    <DashboardLayout
      pathname={pathname}
      campaign={campaign}
      showAlert={false}
      hideMenu
    >
      {!success ? (
        <DomainForm onRegisterSuccess={handleSuccess} />
      ) : (
        <GreatSuccess />
      )}
    </DashboardLayout>
  )
}
