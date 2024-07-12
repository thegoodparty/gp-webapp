import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout';
import BackToAllFiles from './BackToAllFiles';
import Hero from './Hero';
import VideoSection from './VideoSection';
import Paper from '@shared/utils/Paper';
import ActionCards from './ActionCards';
import VoterFileTypes from '../../components/VoterFileTypes';
import VendorCards from './VendorCards';
import { slugify } from 'helpers/articleHelper';
import H2 from '@shared/typography/H2';
import Body2 from '@shared/typography/Body2';

export default function VoterFileDetailPage(props) {
  const { type, campaign, isCustom } = props;
  const fileByKey = {};
  VoterFileTypes.forEach((file) => {
    fileByKey[file.key.toLowerCase()] = file;
  });
  if (
    isCustom &&
    campaign.data?.customVoterFiles &&
    campaign.data?.customVoterFiles.length > 0 &&
    Object.keys(fileByKey).length === 5
  ) {
    campaign.data?.customVoterFiles.forEach((file, i) => {
      const key = `custom-${slugify(file.name, true)}`;
      fileByKey[key] = {
        key,
        isCustom: true,
        name: file.name,
        fields: [file.channel, file.name, file.purpose || ''],
      };
    });
  }

  const file = fileByKey[type];
  const { fields } = file || {};
  const fileName = isCustom ? fields[1] : fields[0];

  return (
    <DashboardLayout {...props}>
      <BackToAllFiles />
      <Hero {...props} fileName={fileName} />
      {!isCustom && type !== 'full' && (
        <>
          <Paper className="my-4">
            <H2>Learn &amp; Take Action</H2>
            <Body2 className="mt-1 mb-4 text-gray-600">
              Review the content below to get the most out of this voter file
            </Body2>
            {/* <VideoSection {...props} /> */}
            <ActionCards {...props} fileName={fileName} />
          </Paper>
          <VendorCards {...props} type={type} />
        </>
      )}
    </DashboardLayout>
  );
}
