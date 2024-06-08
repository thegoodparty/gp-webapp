import pageMetaData from 'helpers/metadataHelper';
import CandidatePage from './components/CandidatePage';

export async function generateMetadata({ params }) {
  const { nameOffice } = params;
  const meta = pageMetaData({
    title: `Candidate Page | GoodParty.org`,
    description: 'todo',
    // image: content.mainImage && `https:${content.mainImage.url}`,
    slug: `/candidate/${nameOffice[0]}`,
  });
  return meta;
}

export default async function Page({ params }) {
  console.log('params', params);
  const { nameOffice } = params;
  const [name, office] = nameOffice;
  console.log('name', name);
  console.log('office', office);

  const candidate = {
    firstName: 'John',
    lastName: 'Doe',
    office: 'City Council, District 7',
    party: 'Independent',
    city: 'Manchester',
    state: 'State',
  };
  const childProps = { candidate };
  return <CandidatePage {...childProps} />;
}
