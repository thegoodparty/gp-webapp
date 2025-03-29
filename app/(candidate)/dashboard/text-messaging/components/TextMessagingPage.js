'use client';
import H1 from '@shared/typography/H1';
import DashboardLayout from '../../shared/DashboardLayout';
import { TextMessagingProvider } from 'app/shared/hooks/TextMessagingProvider';
import TextMessagingRequests from './TextMessagingRequests';

export default function TextMessagingPage(props) {
  return (
    <TextMessagingProvider textMessaging={props.textMessaging}>
      <DashboardLayout {...props} showAlert={false}>
        <div className="mb-8">
          <H1>Text Messaging</H1>
        </div>
        <TextMessagingRequests />
      </DashboardLayout>
    </TextMessagingProvider>
  );
}
