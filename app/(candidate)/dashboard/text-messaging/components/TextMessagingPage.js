import H1 from '@shared/typography/H1';
import DashboardLayout from '../../shared/DashboardLayout';
import TempStartCampaign from './TempStartCampaign';
export default function TextMessagingPage(props) {
  return (
    <DashboardLayout {...props} showAlert={false}>
      <div className="mb-8">
        <H1>Text Messaging</H1>
      </div>
      <TempStartCampaign {...props} />
    </DashboardLayout>
  );
}
