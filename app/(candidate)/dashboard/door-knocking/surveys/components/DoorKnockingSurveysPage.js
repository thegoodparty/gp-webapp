'use client';
import H1 from '@shared/typography/H1';
import Body2 from '@shared/typography/Body2';
import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout';
import DoorKnockingTabs from '../../shared/DoorKnockingTabs';
export default function DoorKnockingSurveysPage(props) {
  return (
    <DashboardLayout {...props} showAlert={false}>
      <div>
        <H1>Surveys</H1>
        <Body2 className="text-gray-500 mb-4">Last updated:</Body2>
      </div>
      <DoorKnockingTabs activeTab={1} />
    </DashboardLayout>
  );
}
