import H1 from '@shared/typography/H1';
import DashboardLayout from '../shared/DashboardLayout';
import TitleSection from '../shared/TitleSection';
import ThisWeekSection from './ThisWeekSection';

export default function DashboardPage(props) {
  return (
    <DashboardLayout {...props}>
      <div className="max-w-[940px] mx-auto">
        <TitleSection
          title="Campaign Tracker"
          subtitle="Leveraging the data from your unique voter outreach figures, we've crafted a 12-week strategic blueprint tailored to optimize your campaign's success."
          imgWidth={128}
          imgHeight={120}
        />
        <ThisWeekSection {...props} />
      </div>
    </DashboardLayout>
  );
}
