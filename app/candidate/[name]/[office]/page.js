import pageMetaData from 'helpers/metadataHelper';
import CandidatePage from './components/CandidatePage';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { notFound } from 'next/navigation';

export const fetchCandidate = async (name, office, bustCache) => {
  const api = gpApi.candidate.find;
  const payload = {
    name,
    office,
    bustCache,
  };
  console.log('payload', payload);
  // return await gpFetch(api, payload, 3600);
  return await gpFetch(api, payload, 0);
};

export async function generateMetadata({ params, searchParams }) {
  const { bustCache } = searchParams;
  const { name, office } = params;
  const { candidate } = await fetchCandidate(
    name,
    office,
    bustCache === 'true',
  );
  const { firstName, lastName, about, image } = candidate || {};
  const meta = pageMetaData({
    title: `${firstName} ${lastName} for ${candidate?.office} | GoodParty.org`,
    description: about,
    image,
    slug: `/candidate/${name}/${office}`,
  });
  return meta;
}

export default async function Page({ params, searchParams }) {
  const { bustCache } = searchParams;
  const { name, office } = params;
  const { candidate } = await fetchCandidate(
    name,
    office,
    bustCache === 'true',
  );
  if (!candidate) {
    notFound();
  }

  // const candidate = {
  //   firstName: 'John',
  //   lastName: 'Doe',
  //   office: 'City Council, District 7',
  //   party: 'Independent',
  //   city: 'Manchester',
  //   state: 'NH',
  //   votesNeeded: 5402,
  //   votersCount: 25321,
  //   independents: 8414,
  //   republicans: 9623,
  //   democrats: 7685,
  //   about: (
  //     <div>
  //       Will Lorem Ipsum SEO, Combined SEO AI, Information We combine using
  //       ballot data, and L2, and then we ask chatgpt to combine and create an
  //       about, and this section will probably be totally wrong but it&apos;s
  //       okay.
  //       <br />
  //       <br />
  //       Will Lorem Ipsum SEO, Combined SEO AI, Information We combine using
  //       ballot data, and L2, and then we ask chatgpt to combine and create an
  //       about, and this section will probably be totally wrong but it&apos;s
  //       okay.
  //     </div>
  //   ),
  //   jobHistory: 'Physics Teacher at Manchester High',
  //   education: 'BS Physics from University of Chicago, Illinois',
  //   militaryService: 'None',
  //   previouslyInOffice: 'Yes',
  //   priorRoles: [
  //     { office: 'City Clerk', years: '2022 - 2024' },
  //     { office: 'Alderman', years: '2020 - 2022' },
  //   ],
  //   yearsInOffice: 4,
  //   officeDescription:
  //     'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
  //   term: '4 Years',
  //   salary: 'Average $82,000/ year',
  //   topIssues: [
  //     'Lorem ipsum dolor sit amet.',
  //     'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  //     'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
  //   ],
  // };
  const childProps = { candidate };
  return <CandidatePage {...childProps} />;
}

const brCandidacy = {
  createdAt: '2024-04-02T20:39:52Z',
  databaseId: 886450,
  id: 'Z2lkOi8vYmFsbG90LWZhY3RvcnkvQ2FuZGlkYWN5Lzg4NjQ1MA==',
  isCertified: true,
  isHidden: false,
  result: 'WON',
  uncertified: false,
  updatedAt: '2024-05-25T23:12:24Z',
  withdrawn: false,
  endorsements: [],
  stances: [],
};

const brData = {
  id: '886450',
  candidacy_id: '886450',
  election_id: '5380',
  election_name: 'Georgia Primary Election',
  election_day: '2024-05-21',
  position_id: '276556',
  mtfcc: 'X0010',
  geo_id: '1300033',
  position_name: 'Georgia Superior Court Judge - Southwestern Circuit, Seat 2',
  sub_area_name: 'Seat',
  sub_area_value: '2',
  sub_area_name_secondary: 'Seat',
  sub_area_value_secondary: '2',
  state: 'GA',
  level: 'state',
  tier: '3',
  is_judicial: 'true',
  is_retention: 'false',
  number_of_seats: '1',
  normalized_position_id: '4027',
  normalized_position_name: 'State Trial Court Judge - General',
  race_id: '2774514',
  geofence_id: '686748',
  geofence_is_not_exact: 'false',
  is_primary: 'false',
  is_runoff: 'false',
  is_unexpired: 'false',
  candidate_id: '408431',
  first_name: 'Jimmie',
  middle_name: '',
  nickname: '',
  last_name: 'Brown',
  suffix: '',
  phone: '229-924-5839',
  email: 'judgejimmiehbrown@gmail.com',
  image_url:
    'https://assets.civicengine.com/uploads/candidate/headshot/408431/408431.jpg',
  parties: '[{"name"=>"Nonpartisan", "short_name"=>"NP"}]',
  urls: '[{"type"=>"government", "website"=>"http://www.southwesterncircuit.com/judges.html"}, {"type"=>"linkedin", "website"=>"https://www.linkedin.com/in/jimmie-brown-018ab099/"}]',
  election_result: 'GENERAL_WIN',
  candidacy_created_at: '2024-04-02 20:39:52.532',
  candidacy_updated_at: '2024-05-25 23:12:24.302',
};

const bpData = {
  election_year: '2024',
  state: 'GA',
  office_id: '47445',
  office_name:
    "Georgia 3rd Superior Court District Southwestern Circuit Brown's Seat",
  office_level: 'Local',
  office_branch: 'Judicial',
  district_id: '103201',
  district_ocdid: '',
  district_name:
    'Third Superior Court District of Georgia Southwestern Circuit',
  district_type: 'Judicial district subdivision',
  parent_district_id: '59489',
  parent_district_name: 'Third Superior Court District of Georgia',
  race_id: '138168',
  race_type: 'Regular',
  seats_up_for_election: '1',
  race_url: '',
  election_date_id: '28954',
  election_date: '2024-05-21',
  election_date_district_type: 'State',
  stage_id: '220425',
  stage: 'General',
  stage_party: '',
  is_partisan_primary: '',
  stage_is_canceled: 'false',
  stage_is_ranked_choice: 'false',
  stage_write_in_other_votes: '',
  candidate_id: '239671',
  person_id: '551609',
  name: 'Jimmie Brown',
  first_name: 'Jimmie',
  last_name: 'Brown',
  ballotpedia_url:
    'https://ballotpedia.org/Jimmie_Brown_(Georgia_3rd_Superior_Court_District_Southwestern_Circuit,_Georgia,_candidate_2024)',
  gender: '',
  party_affiliation: 'Nonpartisan',
  is_incumbent: '',
  candidate_status: 'On the Ballot',
  is_write_in: 'false',
  is_withdrawn_still_on_ballot: 'false',
  votes_for: '',
  votes_against: '',
  delegates_pledged: '',
  ranked_choice_voting_round: '',
  campaign_email: '',
  other_email: '',
  campaign_website: '',
  personal_website: '',
  campaign_phone: '',
};

const techspeed = {
  candidate_id_source: 'TS + BR',
  ballotready_candidate_id: '408431',
  first_name: 'Jimmie',
  last_name: 'Brown',
  is_incumbent: 'UNKNOWN',
  party: 'Nonpartisan',
  email: 'judgejimmiehbrown@gmail.com',
  email_source: '',
  phone: '2299245839',
  phone_clean: '2299245839',
  phone_source: '',
  candidate_id_tier: 'Tier 1',
  website_url: '',
  linkedin_url: '',
  instagram_handle: '',
  twitter_handle: '',
  facebook_url: '',
  source_url: '',
  street_address: '',
  postal_code: '',
  state: 'Georgia',
  county_municipality: '',
  city: 'the Southwestern Circuit',
  district: '2',
  office_name: 'Judge',
  office_normalized: '',
  office_type: 'Judge',
  office_level: 'State',
  filing_deadline: '',
  ballotready_race_id: '',
  primary_election_date: '',
  general_election_date: '5/21/2024',
  is_primary: '',
  is_uncontested: 'UNKNOWN',
  number_candidates: '',
  election_result: '',
};
