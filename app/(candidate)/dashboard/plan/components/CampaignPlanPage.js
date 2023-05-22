import Tabs from '@shared/utils/Tabs';
import DashboardLayout from '../../shared/DashboardLayout';
import TitleSection from './TitleSection';

const tabLabels = ['Messaging', 'Social Media', 'Vision'];

export default function CampaignPlanPage(props) {
  return (
    <DashboardLayout {...props}>
      <TitleSection />
      <Tabs tabLabels={tabLabels} />
    </DashboardLayout>
  );
}
