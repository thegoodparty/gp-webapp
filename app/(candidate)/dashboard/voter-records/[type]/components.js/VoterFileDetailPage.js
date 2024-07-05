import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout';
import BackToAllFiles from './BackToAllFiles';
import Hero from './Hero';
import VideoSection from './VideoSection';
import Paper from '@shared/utils/Paper';
import ActionCards from './ActionCards';

export default function VoterFileDetailPage(props) {
  return (
    <DashboardLayout {...props}>
      <BackToAllFiles />
      <Hero {...props} />
      <Paper className="mt-4">
        <VideoSection {...props} />
        <ActionCards {...props} />
      </Paper>
    </DashboardLayout>
  );
}
