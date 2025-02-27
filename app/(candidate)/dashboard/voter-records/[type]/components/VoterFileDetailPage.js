import DashboardLayout from 'app/(candidate)/dashboard/shared/DashboardLayout';
import BackToAllFiles from './BackToAllFiles';
import Hero from './Hero';
import Paper from '@shared/utils/Paper';
import ActionCards from './ActionCards';
import { getDefaultVoterFileName } from '../../components/VoterFileTypes';
import VendorCards from './VendorCards';
import { slugify } from 'helpers/articleHelper';
import H2 from '@shared/typography/H2';
import Body2 from '@shared/typography/Body2';

const getCustomVoterFile = (customVoterFiles = [], type) =>
  customVoterFiles.find(
    (file) => `custom-${slugify(file.name, true)}` === type,
  );

export default function VoterFileDetailPage(props) {
  const { type, campaign, isCustom } = props;
  const customFile = isCustom
    ? getCustomVoterFile(campaign.data?.customVoterFiles, type)
    : null;
  const fileName = isCustom ? customFile?.name : getDefaultVoterFileName(type);

  return (
    <DashboardLayout {...props}>
      <BackToAllFiles type={type} fileName={fileName} />
      <Hero
        type={type}
        campaign={campaign}
        fileName={fileName}
        customFile={customFile}
      />
      {!isCustom && type !== 'full' && (
        <>
          <Paper className="my-4">
            <H2>Learn &amp; Take Action</H2>
            <Body2 className="mt-1 mb-4 text-gray-600">
              Review the content below to get the most out of this voter file
            </Body2>
            <ActionCards {...props} fileName={fileName} />
          </Paper>
          <VendorCards {...props} type={type} />
        </>
      )}
    </DashboardLayout>
  );
}
