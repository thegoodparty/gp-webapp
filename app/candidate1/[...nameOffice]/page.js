import pageMetaData from 'helpers/metadataHelper';
import CandidatePage from './components/CandidatePage';

export async function generateMetadata({ params }) {
  const { nameOffice } = params;
  const meta = pageMetaData({
    title: `Candidate Page | GoodParty.org`,
    description: 'todo',
    // image: content.mainImage && `https:${content.mainImage.url}`,
    // slug: `/candidate/${nameOffice[0]}`,
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
    state: 'NH',
    votesNeeded: 5402,
    votersCount: 25321,
    independents: 8414,
    republicans: 9623,
    democrats: 7685,
    about: (
      <div>
        Will Lorem Ipsum SEO, Combined SEO AI, Information We combine using
        ballot data, and L2, and then we ask chatgpt to combine and create an
        about, and this section will probably be totally wrong but it&apos;s
        okay.
        <br />
        <br />
        Will Lorem Ipsum SEO, Combined SEO AI, Information We combine using
        ballot data, and L2, and then we ask chatgpt to combine and create an
        about, and this section will probably be totally wrong but it&apos;s
        okay.
      </div>
    ),
    jobHistory: 'Physics Teacher at Manchester High',
    education: 'BS Physics from University of Chicago, Illinois',
    militaryService: 'None',
    previouslyInOffice: 'Yes',
    priorRoles: [
      { office: 'City Clerk', years: '2022 - 2024' },
      { office: 'Alderman', years: '2020 - 2022' },
    ],
    yearsInOffice: 4,
    officeDescription:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
    term: '4 Years',
    salary: 'Average $82,000/ year',
    topIssues: [
      'Lorem ipsum dolor sit amet.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    ],
  };
  const childProps = { candidate };
  return <CandidatePage {...childProps} />;
}