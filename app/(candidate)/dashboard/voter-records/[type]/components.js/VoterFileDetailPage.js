import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout';
import BackToAllFiles from './BackToAllFiles';
import Hero from './Hero';

export default function VoterFileDetailPage(props) {
  return (
    <DashboardLayout {...props}>
      <BackToAllFiles />
      <Hero {...props} />
    </DashboardLayout>
  );
}
