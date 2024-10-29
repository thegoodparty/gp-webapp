import DashboardLayout from '../../shared/DashboardLayout';
import TeamSection from './TeamSection';

export default function CampaignTeamPage(props) {
  return (
    <DashboardLayout {...props}>
      <TeamSection {...props} />
    </DashboardLayout>
  );
}
