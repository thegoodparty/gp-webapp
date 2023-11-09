import pageMetaData from 'helpers/metadataHelper';
import './globals.css';
import HomePage from './homepage/HomePage';
import OptimizeScript from '@shared/scripts/OptimizeScript';
import { fetchCandidate } from './candidate/[slug]/page';

const meta = pageMetaData({
  title: 'GOOD PARTY | Free tools to change the rules and disrupt the corrupt.',
  description:
    "Not a political party, we're building tools to change the rules, empowering creatives to mobilize community & disrupt the corrupt two-party system. Join us!",
  slug: '/',
});

export const metadata = meta;

export default async function Page() {
  let candidates = [];
  let candidateSlugs = [
    'terry-vo',
    'marty-grohman',
    'guillermo-nurse',
    'benjamin-j-weisner',
    'belinda-gerry',
    'bob-ciullo',
    'michael-woods',
    'crystal-rasnake',
    'hattie-m-robinson',
    'jane-rebelowski',
    'troy-meyers',
  ];

  if (process.env.NODE_ENV === 'development') {
    candidateSlugs = ['tomer-almog', 'taylor-murray'];
  }

  for (const slug of candidateSlugs) {
    const { candidate, candidatePositions, reportedVoterGoals } =
      await fetchCandidate(slug);

    let topPosition = '';
    if (candidatePositions && candidatePositions.length > 0) {
      for (const issue of candidatePositions) {
        if (issue?.order && issue.order === 1) {
          topPosition = issue?.position?.name;
          break;
        }
      }
    }
    if (topPosition === '') {
      // only custom issues.
      if (candidate?.customIssues && candidate.customIssues.length > 0) {
        topPosition = candidate.customIssues[0].position;
      }
    }
    if (candidate != undefined) {
      candidate.topPosition = topPosition;
      candidate.reportedVoterGoals = reportedVoterGoals;
      candidates.push(candidate);
    }
  }

  const content = {
    candidates,
  };

  const childProps = {
    content,
  };
  return <HomePage {...childProps} />;
}

const c = {
  slug: 'benjamin-j-weisner',
  lastVisited: 1699468417211,
  details: {
    firstName: 'Benjamin',
    lastName: 'Weisner',
    campaignPhone: '2075145453',
    zip: '04210',
    dob: '1989-08-08',
    citizen: 'yes',
    filedStatement: 'yes',
    campaignCommittee: 'Benjamin Weisner for City council ward 4',
    party: 'Independent',
    otherParty: '',
    knowRun: 'yes',
    state: 'ME',
    office: 'City Council',
    officeTermLength: '2 years',
    otherOffice: '',
    district: 'Ward 4',
    city: 'Auburn',
    articles: '',
    runBefore: 'yes',
    officeRunBefore: 'State Representative ',
  },
  currentStep: 'campaignPlan-3',
  lastStepDate: '2023-11-08',
  hubspotId: '17660075315',
  pathToVictory: {
    totalRegisteredVoters: '9000',
    projectedTurnout: '713',
    winNumber: 364,
    voterContactGoal: 0,
    republicans: 0,
    democrats: 0,
    indies: 0,
    averageTurnout: 0,
    allAvailVoters: 0,
    availVotersTo35: 0,
    women: 0,
    men: 0,
    africanAmerican: 0,
    white: 0,
    asian: 0,
    hispanic: 0,
    voteGoal: '713',
    voterProjection: '713',
    budgetLow: 0,
    budgetHigh: 0,
    voterMap: '',
    finalVotes: '713',
  },
  goals: {
    electionDate: '2023-11-09',
    campaignWebsite: 'http://benweisner.com',
    runningAgainst: [
      {
        name: 'N/A',
        description: 'Running unopposed',
        party: 'Democrat Party',
      },
    ],
  },
  launchStatus: 'launched',
  candidateSlug: 'benjamin-weisner1',
  campaignPlanStatus: {
    slogan: { status: 'completed', createdAt: 1699468403200 },
    aboutMe: { status: 'completed', createdAt: 1699468410175 },
    policyPlatform: { status: 'completed', createdAt: 1699468415163 },
    mobilizing: { status: 'completed', createdAt: 1699468416497 },
    communicationsStrategy: { status: 'completed', createdAt: 1699468421019 },
    pathToVictory: { status: 'completed', createdAt: 1699468423377 },
    messageBox: { status: 'completed', createdAt: 1699468429064 },
    why: { status: 'completed' },
  },
  campaignPlan: {
    policyPlatform:
      '<div class="bg-white p-4">\n  <h1 class="text-2xl font-bold mb-4">Policy Platform</h1>\n  \n  <div class="mb-4">\n    <h2 class="text-xl font-bold mb-2">1. Education Reform</h2>\n    <ul class="list-disc pl-6">\n      <li>Increased funding for public schools</li>\n      <li>Implementing comprehensive curriculum reforms</li>\n      <li>Expanding access to quality early childhood education</li>\n    </ul>\n  </div>\n  \n  <div class="mb-4">\n    <h2 class="text-xl font-bold mb-2">2. Affordable Housing</h2>\n    <ul class="list-disc pl-6">\n      <li>Implementing rent control measures</li>\n      <li>Creating affordable housing incentives for developers</li>\n      <li>Expanding support for first-time homebuyers</li>\n    </ul>\n  </div>\n  \n  <div>\n    <h2 class="text-xl font-bold mb-2">3. Environmental Sustainability</h2>\n    <ul class="list-disc pl-6">\n      <li>Transitioning to renewable energy sources</li>\n      <li>Implementing recycling and waste reduction programs</li>\n      <li>Protecting local parks and green spaces</li>\n    </ul>\n  </div>\n</div>',
    communicationsStrategy:
      '<div class="text-black">\n\n<h2 class="font-bold text-lg">Communication Plan for Benjamin Weisner\'s Campaign</h2>\n\n<h3 class="font-bold mt-4">1. Situation Analysis</h3>\n<p>An assessment of the current political landscape in Ward 4 reveals that Benjamin Weisner is running unopposed in the City Council race. This presents both opportunities and challenges for the campaign. The situation analysis will focus on understanding the key issues and concerns of the residents in Ward 4 and how Benjamin Weisner can effectively address them.</p>\n\n<h3 class="font-bold mt-4">2. Target Audience</h3>\n<p>The campaign\'s target audience in Ward 4 consists of the diverse residents, including their demographics, interests, and concerns. It is essential to identify the best channels to reach them, such as local community events, door-to-door canvassing, and online platforms that resonate well with the community.</p>\n\n<h3 class="font-bold mt-4">3. Message Development</h3>\n<p>We will craft a clear, concise, and compelling message that resonates with the residents of Ward 4. This message will focus on the key issues important to the audience, including their concerns about local infrastructure, education, public safety, and community development.</p>\n\n<h3 class="font-bold mt-4">4. Media Relations</h3>\n<p>The campaign will build strong relationships with local journalists and media outlets to maximize media coverage. We will create press releases, talking points, and other materials to support media outreach. This will help in shaping the narrative around Benjamin Weisner\'s campaign and gaining visibility within the community.</p>\n\n<h3 class="font-bold mt-4">5. Digital Strategy</h3>\n<p>A comprehensive digital strategy will be developed, including a strong presence on social media platforms such as Facebook, Twitter, and Instagram. Compelling digital content will be created to engage with supporters, reach new audiences, and mobilize volunteers. Online platforms will be utilized to showcase Benjamin Weisner\'s values, experience, and plans for the future.</p>\n\n<h3 class="font-bold mt-4">6. Events and Rallies</h3>\n<p>Public events, rallies, and community activities will be organized to generate enthusiasm for the campaign and mobilize supporters in Ward 4. These events will provide opportunities for residents to meet Benjamin Weisner, ask questions, and learn more about his vision for the city.</p>\n\n<h3 class="font-bold mt-4">7. Fundraising</h3>\n<p>A robust fundraising strategy will be developed to support the campaign\'s financial needs. Fundraising goals will be identified, and materials such as donation request letters and fundraising events will be created. Potential donors and fundraising opportunities within Ward 4 will be researched and targeted.</p>\n\n</div>',
    pathToVictory:
      '<div class="bg-gray-100 p-8">\n  <h2 class="text-2xl font-bold mb-4">Candidate Information</h2>\n  <ul class="list-disc list-inside mb-8">\n    <li><strong>Candidate Name:</strong> Benjamin Weisner</li>\n    <li><strong>Office Running For:</strong> City Council in Ward 4</li>\n    <li><strong>Political Party:</strong> Independent</li>\n    <li><strong>Election Date:</strong> 2023-11-09</li>\n    <li><strong>Total Registered Voters:</strong> 9000</li>\n    <li><strong>Average % Turnout:</strong> unknown</li>\n    <li><strong>Projected Turnout:</strong> 713</li>\n  </ul>\n\n  <h2 class="text-2xl font-bold mb-4">Votes Needed by Political Affiliation</h2>\n  <ul class="list-disc list-inside mb-8">\n    <li><strong>Democrats:</strong> 2418 votes</li>\n    <li><strong>Republicans:</strong> 2582 votes</li>\n    <li><strong>Independents:</strong> 2696 votes</li>\n  </ul>\n\n  <h2 class="text-2xl font-bold mb-4">Tactics for Turning Out Votes</h2>\n  <h3 class="text-xl font-bold mb-2">Democrats:</h3>\n  <ul class="list-disc list-inside mb-4">\n    <li>Organize phone banks to reach out to registered Democrats and encourage them to vote.</li>\n    <li>Hold campaign events in areas with a high concentration of Democratic voters to mobilize their support.</li>\n    <li>Create targeted social media ads that highlight key Democratic issues and policies.</li>\n    <li>Collaborate with local Democratic organizations and activists to coordinate voter registration drives.</li>\n  </ul>\n\n  <h3 class="text-xl font-bold mb-2">Republicans:</h3>\n  <ul class="list-disc list-inside mb-4">\n    <li>Door-to-door canvassing in Republican-leaning neighborhoods to engage voters and remind them about the election.</li>\n    <li>Host town hall meetings specifically tailored to address Republican voters\' concerns and priorities.</li>\n    <li>Utilize direct mail campaigns to reach Republican households and provide relevant campaign information.</li>\n    <li>Establish partnerships with Republican-affiliated businesses and organizations for joint promotion and support.</li>\n  </ul>\n\n  <h3 class="text-xl font-bold mb-2">Independents:</h3>\n  <ul class="list-disc list-inside">\n    <li>Develop a comprehensive online presence through a campaign website and active social media accounts.</li>\n    <li>Engage with independent voter groups and community organizations to build relationships and increase visibility.</li>\n    <li>Create compelling campaign materials that appeal to the diverse interests and concerns of independent voters.</li>\n    <li>Host candidate forums specifically targeted at independent voters to discuss their unique perspectives and address their questions.</li>\n  </ul>\n</div>',
    why: '<div class="text-blue-900">\n<h1 class="text-lg font-bold">Why I\'m Running</h1>\n<p class="mt-4">My name is <strong>Benjamin Weisner</strong>, and I am running for the office of City Council in Ward 4 as a member of the Independent party. While my occupation is unknown, I believe that my unique perspective and commitment to serving our community make me the right choice for this position.</p>\n\n<p class="mt-4">Although I don\'t have a specific fun fact to share about myself, I can assure you that my dedication to improving the lives of Ward 4 residents is no joke. I might not have a flashy background or standout accomplishments to boast, but what I lack in resume bullet points, I make up for with genuine care and passion.</p>\n\n<p class="mt-4">My past experience may be unknown, but it has shaped me into a candidate who deeply understands the needs and concerns of our community. I have listened to the stories, worries, and hopes of Ward 4 residents, and I am committed to channeling their voices into action.</p>\n\n<p class="mt-4">I believe in a City Council that prioritizes transparency, inclusivity, and progress. I care deeply about delivering positive change to our neighborhoods by addressing issues such as affordable housing, education, and public safety. <em>*Insert specific action plan/idea if available*</em></p>\n\n<p class="mt-4">By electing me, you aren\'t just choosing another politician; you are electing a dedicated advocate and a fierce listener. I am ready to work tirelessly on your behalf, and together, we can create a Ward 4 where everyone has the opportunity to thrive.</p>\n</div>',
    mobilizing:
      '<div class="p-4">\n  <h2 class="text-xl font-semibold mb-4">Field Plan for Benjamin Weisner</h2>\n  \n  <h3 class="text-lg font-semibold mb-2">1. Voter Targeting</h3>\n  <ul class="list-disc list-inside mb-4">\n    <li>Base voters: Unknown Independents</li>\n    <li>Persuadable voters: Unknown Democrats</li>\n    <li>Voters to avoid: Unknown Republicans</li>\n    <li>Messages to target: Identify key issues and develop messaging accordingly</li>\n    <li>Demographics to focus outreach on:\n      <ul class="list-disc list-inside ml-4">\n        <li>Age range: Minimum: [ageMin], Maximum: [ageMax]</li>\n        <li>Gender breakdown: Unknown women and unknown men</li>\n        <li>Party affiliation: Independents, Democrats</li>\n      </ul>\n    </li>\n  </ul>\n\n  <h3 class="text-lg font-semibold mb-2">2. Canvassing Strategy</h3>\n  <ul class="list-disc list-inside mb-4">\n    <li>Recruit and train volunteers</li>\n    <li>Develop materials: scripts and literature</li>\n    <li>Timeline for canvassing:\n      <ul class="list-disc list-inside ml-4">\n        <li>Work backwards from election day [electiondate]</li>\n        <li>Set weekly door knocking goals</li>\n        <li>Assume a shift is 4 hours of canvassing</li>\n        <li>Target to knock on 100 doors per hour</li>\n      </ul>\n    </li>\n  </ul>\n\n  <h3 class="text-lg font-semibold mb-2">3. Phone Banking</h3>\n  <ul class="list-disc list-inside mb-4">\n    <li>Recruit and train volunteers</li>\n    <li>Timeline for phone banking:\n      <ul class="list-disc list-inside ml-4">\n        <li>Work backwards from election day [electiondate]</li>\n        <li>Set weekly phone call goals</li>\n        <li>Assume a shift is 4 hours of calling</li>\n        <li>Target to make 12 contacts per hour</li>\n      </ul>\n    </li>\n  </ul>\n\n  <h3 class="text-lg font-semibold mb-2">4. Voter Registration</h3>\n  <ul class="list-disc list-inside mb-4">\n    <li>Identify unregistered voters in the area with zip code 04210</li>\n    <li>Provide information about the registration process</li>\n    <li>Assist with voter registration</li>\n  </ul>\n\n  <h3 class="text-lg font-semibold mb-2">5. Get-Out-The-Vote (GOTV)</h3>\n  <ul class="list-disc list-inside mb-4">\n    <li>Develop a plan to remind supporters to vote</li>\n    <li>Provide information about polling locations and hours</li>\n    <li>Offer transportation to the polls, if necessary</li>\n    <li>Feasibly aim to increase supportive voter turnout by 2 to 5%</li>\n  </ul>\n\n  <h3 class="text-lg font-semibold mb-2">6. Data Management</h3>\n  <ul class="list-disc list-inside mb-4">\n    <li>Track voter contact information</li>\n    <li>Record canvassing results</li>\n    <li>Manage other relevant campaign data</li>\n  </ul>\n\n  <p class="text-sm">Overall, the field plan aims to comprehensively target and mobilize Benjamin Weisner\'s base and persuadable voters while avoiding voters from the opposing party. The plan includes canvassing, phone banking, voter registration, and GOTV strategies, all supported by effective data management. The plan should remain flexible to adapt to any unforeseen circumstances or changes in the political landscape.</p>\n</div>',
    slogan:
      '"Benjamin Weisner: Your Voice for a Stronger and United Community"',
    aboutMe:
      "I am an independent candidate running for City Council in Ward 4. While my occupation, past experience, and even my fun fact may be unknown, what is known is my deep care and commitment for the well-being of our community. I believe in the importance of open communication, active listening, and inclusivity in decision-making processes. As a member of City Council, I aim to prioritize the needs and concerns of our diverse residents and work towards creating positive change. Together, we can build a better future for Ward 4, where every individual's voice is heard and where progress is made through collaboration and empathy.",
    messageBox:
      '<div class="grid grid-cols-2 gap-4">\n  <div class="bg-blue-200">\n    <h3 class="text-lg font-bold">What I Will Say About Myself</h3>\n    <p>Born and raised in Ward 4, I am deeply committed to the well-being and progress of our community. As an independent candidate, I bring a fresh perspective and a dedication to representing the interests of all residents, free from the influence of any political party. I believe in transparency, accountability, and collaborative decision-making. Together, we can build a better future for Ward 4.</p>\n  </div>\n  \n  <div class="bg-yellow-200">\n    <h3 class="text-lg font-bold">What I Will Say About My Opponent</h3>\n    <p>Although my opponent is running unopposed, I respect their decision to participate in this election process. While I may not agree with their party affiliation, I believe in healthy competition and the opportunity for voters to have a choice. I encourage them to share their ideas and proposals with the community, and I welcome a respectful and fair campaign.</p>\n  </div>\n  \n  <div class="bg-red-200">\n    <h3 class="text-lg font-bold">What My Opponent Will Say About Me</h3>\n    <p>My opponent will likely attempt to portray me as inexperienced and unknown due to a lack of information about my occupation, past experience, and specific interests. They may claim that my independent status makes it difficult for me to effectively advocate for the needs of Ward 4 residents or align with any particular set of policies or values. However, I believe that my dedication to our community and my passion for collaboration will speak for itself.</p>\n  </div>\n  \n  <div class="bg-green-200">\n    <h3 class="text-lg font-bold">What My Opponent Will Say About Themselves</h3>\n    <p>Since my opponent is running unopposed, they might emphasize their party affiliation as a positive aspect, highlighting their alignment with the Democratic Party and its values. They may stress their experience or previous achievements, positioning themselves as a reliable and qualified candidate who can effectively represent Ward 4. Being unopposed, they may also urge voters to support them to maintain stability and continuity in the City Council.</p>\n  </div>\n</div>',
  },
  p2vStatus: 'Waiting',
};
