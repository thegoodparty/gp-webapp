'use client'
import DashboardLayout from '../../shared/DashboardLayout'
import { TextMessagingProvider } from 'app/shared/hooks/TextMessagingProvider'
import NoCompliance from './NoCompliance'
import { StyledAlert } from '@shared/alerts/StyledAlert'
import { TenDLCProvider } from '@shared/hooks/TenDLCProvider'

export default function TextMessagingPage(props) {
  return (
    <TenDLCProvider compliance={props.compliance}>
      <TextMessagingProvider textMessaging={props.textMessaging}>
        <DashboardLayout {...props} showAlert={false}>
          <StyledAlert severity="warning" className="flex items-center mb-4">
            This is visible for admins only
          </StyledAlert>
          {!props.compliance && <NoCompliance />}
        </DashboardLayout>
      </TextMessagingProvider>
    </TenDLCProvider>
  )
}
