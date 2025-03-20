import H1 from '@shared/typography/H1';
import Body2 from '@shared/typography/Body2';
import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout';
import DoorKnockingTabs from '../../shared/DoorKnockingTabs';
import SurveyList from './SurveyList';
export default function DoorKnockingSurveysPage(props) {
  return (
    <DashboardLayout {...props} showAlert={false}>
      <div>
        <H1>Door Knocking Scripts</H1>
        <Body2 className="text-gray-500 mb-4">
          Found {props.surveys?.length || 0} door knocking scripts. Click on a
          script to manage it.
        </Body2>
      </div>
      <DoorKnockingTabs activeTab={1} />
      <SurveyList {...props} />
    </DashboardLayout>
  );
}
