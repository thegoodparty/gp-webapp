import Paper from '@shared/utils/Paper';
import VoterFileTypes from '../../components/VoterFileTypes';
import H2 from '@shared/typography/H2';
import Body2 from '@shared/typography/Body2';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import Overline from '@shared/typography/Overline';
import RecordCount from './RecordCount';
import Chip from '@shared/utils/Chip';
import slugify from 'slugify';
import DownloadFile from './DownloadFile';

export default function Hero(props) {
  const { type, campaign, fileName } = props;
  if (
    campaign.data?.customVoterFiles &&
    campaign.data?.customVoterFiles.length > 0 &&
    VoterFileTypes.length === 6
  ) {
    campaign.data?.customVoterFiles.forEach((file, i) => {
      VoterFileTypes.push({
        key: `custom-${slugify(file.name)}`,
        index: i,
        isCustom: true,
        name: file.name,
        fields: [
          file.channel,
          file.name,
          file.purpose || '',
          <Chip
            key="custom"
            className="bg-orange-700 text-white"
            label="CUSTOM VOTER FILE"
          />,
        ],
      });
    });
  }
  const fileByKey = {};
  VoterFileTypes.forEach((file) => {
    fileByKey[file.key.toLowerCase()] = file;
  });

  const file = fileByKey[type];
  const { isCustom, index } = file || {};

  return (
    <Paper className="mt-4">
      <div className="md:flex justify-between">
        <div>
          <H2>{fileName}</H2>
          <Body2 className="mt-2">
            Key data associated with this voter file.
          </Body2>
        </div>
        <DownloadFile {...props} isCustom={isCustom} index={index} />
      </div>
      <div className="mt-6 grid grid-cols-12 gap-4">
        <div className=" col-span-12">
          <Paper>
            <Overline className="mb-2"># of Records</Overline>
            <RecordCount {...props} isCustom={isCustom} index={index} />
          </Paper>
        </div>
      </div>
    </Paper>
  );
}
