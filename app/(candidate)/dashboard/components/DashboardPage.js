import H1 from '@shared/typography/H1';
import DashboardLayout from '../shared/DashboardLayout';
import TitleSection from '../shared/TitleSection';

export default function DashboardPage(props) {
  return (
    <DashboardLayout {...props}>
      <H1>Campaign Tracker</H1>
      <TitleSection
        title="Campaign Tracker - Coming Soon"
        subtitle="Good Party GPT can help you create high quality content for your campaign"
        image="/images/dashboard/content.svg"
        imgWidth={128}
        imgHeight={120}
      />
    </DashboardLayout>
  );
}
