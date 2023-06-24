import DashboardLayout from '../../shared/DashboardLayout';
import TitleSection from '../../shared/TitleSection';
import AiContent from './AiContent';
import MyContent from './MyContent';

export default function ContentPage(props) {
  return (
    <DashboardLayout {...props}>
      <TitleSection
        title="My Content"
        subtitle="Good Party GPT can help you create high quality content for your campaign"
        image="/images/dashboard/content.svg"
        imgWidth={120}
        imgHeight={120}
      />
      <MyContent {...props} />
      <AiContent {...props} />
    </DashboardLayout>
  );
}
