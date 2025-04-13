'use client'
import DashboardLayout from '../../shared/DashboardLayout'
import { TextMessagingProvider } from 'app/shared/hooks/TextMessagingProvider'
import NoCompliance from './NoCompliance'
export default function TextMessagingPage(props) {
  return (
    <TextMessagingProvider
      textMessaging={props.textMessaging}
      compliance={props.compliance}
    >
      <DashboardLayout {...props} showAlert={false}>
        {!props.compliance && <NoCompliance />}
      </DashboardLayout>
    </TextMessagingProvider>
  )
}
