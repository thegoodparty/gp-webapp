import H1 from '@shared/typography/H1';
import DashboardLayout from '../../shared/DashboardLayout';
import ChatHistory from './ChatHistory';

export default function CampaignManagerPage(props) {
  return (
    <DashboardLayout {...props}>
      <div className="p-4 max-w-[900px] mx-auto">
        <ChatHistory />
      </div>
    </DashboardLayout>
  );
}
