'use client'
import DashboardLayout from '../../shared/DashboardLayout'
import { TextMessagingProvider } from 'app/shared/hooks/TextMessagingProvider'
import NoCompliance from './NoCompliance'
import { StyledAlert } from '@shared/alerts/StyledAlert'
export default function TextMessagingPage(props) {
  return (
    <TextMessagingProvider
      textMessaging={props.textMessaging}
      compliance={props.compliance}
    >
      <DashboardLayout {...props} showAlert={false}>
        <StyledAlert severity="warning" className="flex items-center mb-4">
          This is visible for admins only
        </StyledAlert>
        {!props.compliance && <NoCompliance />}
      </DashboardLayout>
    </TextMessagingProvider>
  )
}
