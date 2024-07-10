import Paper from '@shared/utils/Paper';
import VendorCard from './VendorCard';

function vendorsByType(type) {
  let vendors;
  if (type === 'directmail') {
    vendors = [
      {
        logo: '/images/voterfile/mailing-logo.svg',
        name: 'Mailing.com',
        url: 'https://www.mailing.com/',
        subTitle: 'Turnkey Direct Mail Services at Scale',
        description:
          'Seamlessly execute your direct mail marketing campaigns and create exceptional print-based brand experiences.',
      },
      {
        logo: '/images/voterfile/speakeasy-logo.svg',
        name: 'SpeakEasy Political',
        url: 'https://www.speakeasypolitical.com/',
        subTitle: 'High-Impact Direct Mail Campaigns',
        description:
          'Our political direct mail templates are field tested and professionally designed to have a profound impact on voters, and propel your campaign to victory.',
      },
    ];
  }
  return vendors;
}

export default function VendorCards(props) {
  const { type } = props;

  const vendors = vendorsByType(type);

  if (!vendors) {
    return null;
  }

  return (
    <Paper className="mt-4">
      <div className="mt-4 grid grid-cols-12 gap-4">
        {vendors.map((card, index) => (
          <div className="col-span-12  h-full md:col-span-6" key={index}>
            <VendorCard {...card} />
          </div>
        ))}
      </div>
    </Paper>
  );
}
