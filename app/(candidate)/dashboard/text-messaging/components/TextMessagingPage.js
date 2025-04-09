'use client'
import H1 from '@shared/typography/H1'
import DashboardLayout from '../../shared/DashboardLayout'
import { TextMessagingProvider } from 'app/shared/hooks/TextMessagingProvider'
import TextMessagingRequests from './TextMessagingRequests'
import NoCompliance from './NoCompliance'
export default function TextMessagingPage(props) {
  return (
    <TextMessagingProvider
      textMessaging={props.textMessaging}
      compliance={props.compliance}
    >
      <DashboardLayout {...props} showAlert={false}>
        <div className="mb-8">
          <H1>Text Messaging</H1>
        </div>
        {!props.compliance && <NoCompliance />}
        {/* <TextMessagingRequests /> */}
      </DashboardLayout>
    </TextMessagingProvider>
  )
}
