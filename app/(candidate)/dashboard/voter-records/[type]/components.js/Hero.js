import Paper from '@shared/utils/Paper';
import VoterFileTypes from '../../components/VoterFileTypes';
import H2 from '@shared/typography/H2';
import Body2 from '@shared/typography/Body2';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import Overline from '@shared/typography/Overline';
import MarketingH2 from '@shared/typography/MarketingH2';

const fileByKey = {};
VoterFileTypes.forEach((file) => {
  fileByKey[file.key.toLowerCase()] = file;
});

export default function Hero(props) {
  const { type } = props;
  const file = fileByKey[type];
  const { name, fields } = file;

  return (
    <Paper className="mt-4">
      <div className="md:flex justify-between">
        <div>
          <H2>{fields[1]}</H2>
          <Body2 className="mt-2">
            Key data associated with this voter file.
          </Body2>
        </div>
        <div className="mt-3 md:mt-0">
          <PrimaryButton>Download CSV</PrimaryButton>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-12 gap-4">
        <div className=" col-span-12 md:col-span-6">
          <Paper>
            <Overline className="mb-2"># of Records</Overline>
            <MarketingH2>12,345</MarketingH2>
          </Paper>
        </div>
      </div>
    </Paper>
  );
}
