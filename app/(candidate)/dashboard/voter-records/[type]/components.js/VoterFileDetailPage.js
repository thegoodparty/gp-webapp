import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout';
import BackToAllFiles from './BackToAllFiles';
import Hero from './Hero';
import VideoSection from './VideoSection';
import Paper from '@shared/utils/Paper';
import ActionCards from './ActionCards';
import VoterFileTypes from '../../components/VoterFileTypes';

export default function VoterFileDetailPage(props) {
  const { type } = props;
  const fileByKey = {};
  VoterFileTypes.forEach((file) => {
    fileByKey[file.key.toLowerCase()] = file;
  });

  const file = fileByKey[type];
  const { fields } = file || {};
  const fileName = fields[1];

  return (
    <DashboardLayout {...props}>
      <BackToAllFiles />
      <Hero {...props} fileName={fileName} />
      <Paper className="mt-4">
        <VideoSection {...props} />
        <ActionCards {...props} fileName={fileName} />
      </Paper>
    </DashboardLayout>
  );
}
