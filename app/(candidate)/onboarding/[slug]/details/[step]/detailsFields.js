import { validateZip } from 'app/(entrance)/register/components/RegisterPage';
import { flatStates } from 'helpers/statesHelper';

const detailsFields = [
  {
    title:
      "Hi! I'm Good Party's AI Campaign Manager. I just need a little bit of information to get you started...",

    fields: [
      {
        key: 'firstName',
        label: 'Candidate First Name',
        required: true,
        type: 'text',
      },
      {
        key: 'lastName',
        label: 'Candidate Last Name',
        required: true,
        type: 'text',
      },
    ],
  },
  {
    title:
      "We'll help you figure out the best way to run a successful campaign where you live.",
    fields: [
      {
        key: 'zip',
        label: 'Zip Code',
        required: true,
        type: 'text',
        validate: validateZip,
      },
    ],
  },
  {
    title: "Let's verify your eligibility to run for office.",
    fields: [
      {
        key: 'dob',
        label: 'Date of Birth',
        required: true,
        type: 'date',
        validate: 'over 18',
      },
      {
        key: 'citizen',
        label: 'Are you a U.S. Citizen?',
        required: true,
        type: 'radio',
        options: ['Yes', 'No'],
        validateOptions: ['yes', 'No'],
      },
    ],
  },

  {
    title: "Thanks! What's your political affiliation, if you have any?",
    fields: [
      {
        key: 'party',
        label: 'Political Party Affiliation (select one)',
        required: true,
        type: 'select',
        options: [
          'Independent',
          'Democratic Party',
          'Republican Party',
          'Green Party',
          'Libertarian Party',
          'Forward Party',
          'Other',
        ],
        invalidOptions: ['Democratic Party', 'Republican Party'],
      },
      {
        key: 'otherParty',
        label: 'Party Name',
        type: 'text',
        hidden: true,
        showKey: 'party',
        showCondition: ['Other'],
      },
    ],
  },
  {
    title: 'Do you know where you want to run?',
    fields: [
      {
        key: 'knowRun',
        label: '',
        required: true,
        type: 'radio',
        options: ['Yes, I do', 'I need help'],
        validateOptions: ['yes'],
      },
      {
        key: 'state',
        label: 'State',
        type: 'select',
        options: flatStates,
        hidden: true,
        showKey: 'knowRun',
        showCondition: ['yes'],
        required: true,
      },
      {
        key: 'office',
        label: 'Office',
        type: 'select',
        hidden: true,
        showKey: 'knowRun',
        required: true,
        showCondition: ['yes'],
        options: [
          'City Council',
          'Mayor',
          'US Senate',
          'US House of Representatives',
          'Governor',
          'Lieutenant Governor',
          'Attorney General',
          'Comptroller',
          'Treasurer',
          'Secretary of State',
          'State Supreme Court Justice',
          'State Senate',
          'State House of Representatives',
          'County Executive',
          'District Attorney',
          'Sheriff',
          'Clerk',
          'Auditor',
          'Public Administrator',
          'Judge',
          'County Commissioner',
          'Council member',
          'School Board',
          'Other',
        ],
      },
      {
        key: 'district',
        label: 'Jurisdiction (City, District, etc.)',
        type: 'text',
        hidden: true,
        requiredHidden: true,
        showKey: 'office',
        showCondition: [
          'City Council',
          'Mayor',
          'US House of Representatives',
          'State Senate',
          'State House of Representatives',
          'County Executive',
          'District Attorney',
          'Sheriff',
          'Clerk',
          'Auditor',
          'Public Administrator',
          'Judge',
          'County Commissioner',
          'Council member',
          'School Board',
          'Other',
        ],
      },
      {
        key: 'articles',
        type: 'articles',
        hidden: true,
        showKey: 'knowRun',
        showCondition: ['no'],
        articles: [],
        title:
          "Looks like you want to explore running for office but aren't sure where to start? No problem!",
        subTitle:
          "You have a ton of options to choose from. With over 500,000 local, state and federal offices to choose from it can be a bit overwhelming. Good news though, we've narrowed it down to the offices you can choose from based on your current residency.",
      },
    ],
  },
  {
    title: 'Have you run for office before?',
    fields: [
      {
        key: 'runBefore',
        label: '',
        required: true,
        type: 'radio',
        options: ['Yes', 'No'],
      },
      {
        key: 'officeRunBefore',
        label: 'What office?',
        type: 'text',
        hidden: true,
        showKey: 'runBefore',
        showCondition: ['yes'],
      },
    ],
  },
  {
    title:
      'Tell us about your past experiences and why you want to run for office',
    subTitle:
      'Tell potential voters about your prior experience. Any work or experiences that are relevant to the role you plan to run for will increase your odds of gaining their support.',
    fields: [
      {
        key: 'pastExperience',
        label: '',
        placeholder:
          'EXAMPLE: I have 5 years of experience on the local school board, where I worked to improve the quality of education by developing policies, securing funding, and establishing partnerships. This led to higher student achievement, increased graduation rates, and better school facilities. This experience has equipped me with the skills and commitment needed to serve as an elected official.',
        required: true,
        type: 'text',
        rows: 10,
      },
    ],
  },
  {
    title: 'What is your current occupation?',
    fields: [
      {
        key: 'occupation',
        label: '',
        required: true,
        type: 'text',
      },
    ],
  },
  {
    title: 'What is a fun fact about yourself?',
    subTitle:
      "What's something fun or interesting about you- unrelated to politics- that you think people in your community would like to know?",
    fields: [
      {
        key: 'funFact',
        label: '',
        placeholder:
          "EXAMPLE: In my free time, I love to play the guitar and write songs. I've even performed at a few local open mic nights! Music has been a passion of mine for as long as I can remember, and I believe that it has helped me to develop creativity, perseverance, and a willingness to take risks. Whether I'm writing a song or crafting a policy proposal, I bring the same level of enthusiasm and dedication to everything I do.",
        required: true,
        type: 'text',
        rows: 8,
      },
    ],
  },
  {
    pageType: 'issuesPage',
    title: 'Tell us about 3 to 5 issues you care about and why.',
    fields: [],
  },
  {
    pageType: 'pledgePage',
    title: 'Good Party User Agreement.',
    fields: [],
  },
  {
    pageType: 'finalDetailsPage',
    title:
      'Thanks for taking the first step to get in the arena and create change!',
    fields: [],
  },
];

export default detailsFields;

let detailFieldsCount = 0;
detailsFields.forEach((step) => {
  detailFieldsCount += step.fields?.length || 0;
});

detailFieldsCount = detailFieldsCount - 5; // pledge and top issues
export { detailFieldsCount };

var a = {
  slug: 'peter-healy',
  details: {
    firstName: 'Peter',
    lastName: 'Healy',
    zip: '37206',
    dob: '1985-11-14',
    citizen: 'yes',
    party: 'Independent',
    otherParty: '',
    knowRun: 'yes',
    state: 'TN',
    office: 'City Council',
    district: '6',
    articles: '',
    runBefore: 'no',
    officeRunBefore: '',
    pastExperience:
      "I'm running because, I'm tired of standing by and watching our political system squeeze out and steam roll the marginalized and the voiceless.  I'm tired of watching the system work to make the rich get richer as opposed to allowing the rising tide in Nashville to lift all ships.  I've stood by long enough hoping that the system will correct itself and it's become evident that it will not, so it's time for me to step into the arena, to be the change I wish to see, and to dismantle the broken, corrupt, and insular system that no longer represents and advocates for the very people it was designed to serve.  \n\nI can no longer sit on the sidelines and listen to each political extreme shout into the abyss of their own echo chamber, no longer seeking to find common ground, but playing the dangerous game of demonizing any ideas that differ from their own.  One side seeks to ban books to protect their puritan youth from any ideas that expand their world view while the other protests to ban speakers on college campuses with whom they disagree, or who's platform makes them feel uncomfortable.\n\nDiscomfort is the only way through our current debacle.  If we can ride out the discomfort to seek a middle ground, we can abolish the resentment, the demonization, and the dehumanization that each side's most extreme, and therefore loudest, voices have been proliferating.  If we want to save our democracy, it starts with knowing your \"enemy.\"  You cannot hate up close.\n\nI am an experienced and driven leader with a longstanding commitment to and proven track record of organizing communities around unifying causes. \n   \nMore than anything, my passion is to do meaningful work and to leave a positive impact on the people I encounter along the way. \n\nI've spent years working in the food and agriculture space, ranging from farm management to food security program management, while developing collaborative relationships with growers, researchers, and laborers from all walks of life in Spanish and English.\n\nAt the Agricultural Institute of Marin, I directed the operation of seven of the San Francisco Bay Area's top farmers markets, including the management of twelve staff and $1M in annual revenue. My daily duties ranged from cleaning public restrooms to meeting with county supervisors and advocating for the small family farms we helped incubate. The work that energized me the most was the launch of a mobile farmers market food truck, aimed at supplying underserved communities with affordable, healthy, and culturally appropriate food options.  I secured $150k in grant funding, conducted a year of community outreach, lobbied for regulatory variances and held strategic meetings with local politicians and community leaders.  I’m proud to say that the Rollin’ Root has received an Excellence in Innovation award since its launch and is accomplishing its designed goals of creating access where inequitable food systems fall short.\n\n\nMoreover, I spent the first few years of my career as an Environmental Scientist, remediating brown fields in the San Francisco Bay Area while managing teams of contractors and interfacing with high profile clients at oil and gas companies, where I learned to communicate effectively with people from all walks of life. My meticulous attention to detail was crucial in my day-to-day tasks, as much of the field and laboratory data I collected, analyzed and reported on was scrutinized by various regulatory agencies to determine whether or not my clients had met their legal obligations. The passion and work ethic I poured into my time at this Fortune 500 Company resulted in my receipt of a Junior Professional Award.\n\nYou may notice a gap in my professional experience, as for a few years I've been home with my two young sons, learning to see the world through their eyes.  While on sabbatical from the professional world, I pursued a 200-Hour Yoga Teacher Training certificate as a way to continue my own personal growth outside of the workplace.  With this self inquiry has come a whole new perspective on the world I want to leave behind for my sons, and I can think of no better example I would like to set for them than working  to make the system of government work for ordinary people trying to make ends meet.",
    occupation: 'Environmental Scientist, Yoga Teacher, Home Parent',
    funFact:
      "I practice yoga 4-5 times a week, and teach 3-4 times a week.  I've been volunteering with Small World Yoga for almost 5 years, teaching free yoga classed in davidson country schools and to inmates in the davidson county prison system.\n\nI've lived in three different countries, I've been a home parent for the last 4 years, and I just performed in an improv comedy showcase. I play some guitar and write songs that no one has ever heard, and my favorite pass time is dodging leftover legos strewn about the house while chasing my boys around and playing \"dad-zilla\"",
    topIssues: {
      positions: [
        {
          createdAt: 1649219354576,
          updatedAt: 1649219354576,
          id: 66,
          name: 'Fix Roads And Bridges',
          topIssue: {
            createdAt: 1649219354562,
            updatedAt: 1649219354562,
            id: 12,
            name: 'Transportation',
          },
        },
        {
          createdAt: 1649219354371,
          updatedAt: 1649225563626,
          id: 6,
          name: 'Pro Choice',
          topIssue: {
            createdAt: 1649219354365,
            updatedAt: 1649219354365,
            id: 2,
            name: 'Abortion',
          },
        },
        {
          createdAt: 1649219354770,
          updatedAt: 1649219354770,
          id: 128,
          name: 'Stop Book Bans',
          topIssue: {
            createdAt: 1649219354758,
            updatedAt: 1649219354758,
            id: 21,
            name: 'Education',
          },
        },
        {
          createdAt: 1649219354589,
          updatedAt: 1649219354589,
          id: 71,
          name: 'Ranked Choice Voting',
          topIssue: {
            createdAt: 1649219354582,
            updatedAt: 1649219354582,
            id: 13,
            name: 'Electoral Reform',
          },
        },
        {
          createdAt: 1649219354609,
          updatedAt: 1649219354609,
          id: 79,
          name: 'Stop Gerrymandering',
          topIssue: {
            createdAt: 1649219354582,
            updatedAt: 1649219354582,
            id: 13,
            name: 'Electoral Reform',
          },
        },
        {
          createdAt: 1649219354629,
          updatedAt: 1649219354629,
          id: 84,
          name: 'Affordable Housing',
          topIssue: {
            createdAt: 1649219354613,
            updatedAt: 1649219354613,
            id: 14,
            name: 'Housing',
          },
        },
      ],
      'position-66':
        "One thing we all do every day is drive on Nashville roads. our city is the financial hub of the state of TN and businesses from all over the country are investing in this city and building their headquarters here and I can't even drive a mile without hitting a giant pothole that shakes my son in his carseat or sends the car in front of me into a tailspin.",
      'position-6':
        'No one wants the to make the difficult decision to end a pregnancy, and no one is relying on abortion as a form of birth control.  this difficult healthcare decision should only be made with the careful consideration of the mother and her healthcare team.  The government has no right to tell a woman what to do with her body.',
      'position-128':
        "We cannot protect our children from ideas.  We can only equip them to think critically about the people and the philosophies they encounter throughout their lives.   Parents can create an nurturing environment in the home so kids can feel comfortable having hard conversations.  There's no way to protect them from the ideas they might disagree with. Books bans are a suppression of speech, and ideas.",
      'position-71':
        'Ranked Choice Voting gives you more say in who gets elected. Even if your top choice candidate does not win, you can still help choose who does. More civility and less negative campaigning.  This allows for people to vote their conscience without having to worry about "wasting" a vote and only settling for the lesser of two evils.  additionally, ranked choice voting will move us away from polarizing extremist candidates. ',
      'position-79':
        'One of the greatest threats to our representative democracy is partisan gerrymandering, used to consolidate votes and silence what would otherwise be majority rule and popular opinion.  Voters should choose their politicians, not the other way around.\n\nWe can move to a system of proportional representation, ensuring that every vote counts equally, and every voter matters. establishing independent redistricting commissions  is the only way to make sure each voice is heard and each vote matters.',
      'position-84':
        "As Nashville's growth has it bursting at the county line's seams, with new people with higher income levels, we cannot simply abandon the people who've built the city into what it is today, and who've called this city their home.  The workforce who bolster the tourism industry that drives our city's economy, affordable \"work force\" housing that allows for a reasonable commute to work, at a reasonable cost.  No one who works full time should be unable to afford a place to live in our city.  No one who wakes up every day to work at a restaurant, service cars, stripe roads, keep our utilities running, clean hotel rooms, or drive our kids to school on a bus, should be unable to afford a place to live in our county.  Developers making money hand over fist have an obligation to chip in to help solve the problem.  Hoteliers and Honky Tonk operators making money employing this workforce have a responsibility to make sure their employees have a safe place to ret their heads at night.",
    },
    pledged: true,
  },
  campaignPlanStatus: {
    policyPlatform: 'completed',
    aboutMe: 'completed',
    slogan: 'completed',
    why: 'completed',
    messageBox: 'processing',
    communicationsStrategy: 'processing',
    pathToVictory: 'processing',
    getOutTheVote: 'processing',
    mobilizing: 'processing',
    timeline: 'processing',
    operationalPlan: 'processing',
  },
  campaignPlan: {
    slogan:
      '1. Together for Change.\n2. Peter Paves Progress.\n3. Brighter Future Ahead.',
    aboutMe:
      "\n  <h2>About Peter Healy</h2>\n  <p>My name is Peter Healy and I am running for office in City Council as an Independent candidate. Professionally, I've worked as an Environmental Consultant, a Non Profit Program Director, and Yoga Teacher.&nbsp; My most rewarding \"job\" has been my title as home parent, where I've had the privilege of spending more time with my kids than most fathers have the opportunity to do.&nbsp; More than anything, my passion is to do meaningful work and to leave a positive impact on the people I encounter along the way. I have lived in three different countries,&nbsp;and I'm an improv comedy player. A fun fact about me is that I teach yoga to convicted felons at the Davidson Country Sheriff's office.</p>\n  <h3>Experience</h3>\n  <h4>Stony Creek Colors</h4>\n  <p>At Stony Creek Colors, I worked with partner farmers to offer an alternative crop to corn, soy and tobacco contracts that were steadily drying up. Our indigo offered a cash crop in their rotation with regenerative attributes and pest suppressing qualities. I directed the seeding of over 5 million transplants to finding them a home in TN, KY, GA, TX, and MS, and have developed a keen knowledge of both the agronomics and commercial viability of scaling up indigo production, while developing collaborative relationships with growers, researchers, and laborers from all walks of life in Spanish and English.</p>\n  <h4>Also Organics</h4>\n  <p>As the Social Media Manager and Brand Strategist at Also Organics, a direct to consumer packaged goods company, I grew our social media following from zero to 20k in less than a year using iconic imagery and clever copy to create a sense of community and buy-in from our loyal customers. I created, edited and approved content and copy in collaboration with our branding agency to create appealing packaging, enticing advertisements, and an engaging website designed to inform and excite our customer base. Additionally, with clear and concise automated messaging from the moment of purchase to the delivery of the product, we created a high touch customer experience without draining our resources.</p>\n  <h4>Agricultural Institute of Marin</h4>\n  <p>At the Agricultural Institute of Marin, I directed the operation of seven of the San Francisco Bay Area's top farmers markets, including the management of twelve staff and $1M in annual revenue. I launched a mobile farmers market food truck, aimed at supplying underserved communities with affordable, healthy, and culturally appropriate food options. I secured $150k in grant funding, conducted a year of community outreach, lobbied for regulatory variances and held strategic meetings with local politicians and community leaders. The Rollin’ Root has received an Excellence in Innovation award since its launch and is accomplishing its designed goals of creating access where inequitable food systems fall short.</p>\n  <h4>Environmental Scientist</h4>\n  <p>For the first few years of my career, I was an Environmental Scientist remediating brownfields in the San Francisco Bay Area while managing teams of contractors and interfacing with high-profile clients at oil and gas companies. I collected, analyzed and reported on field and laboratory data that was scrutinized by various regulatory agencies to determine whether or not my clients had met their legal obligations. My passion and work ethic resulted in my receipt of a Junior Professional Award.</p>\n  <h3>Gaps in Professional Experience</h3>\n  <p>You may notice a gap in my professional experience, as for two years I was home with my two young sons, learning to see the world through their eyes. While on sabbatical from the professional world, I pursued a 200-Hour Yoga Teacher Training certificate as a way to continue my own personal growth outside of the workplace. With this self-inquiry has come a whole new perspective on the world I want to leave behind for my sons, and I can think of no better example I would like to set for them than working for an organization built around securing the future of the world they will one day inherit.</p>\n  <h3>My Priorities</h3>\n  <p>I care about fixing roads and bridges (Transportation), supporting pro-choice (Abortion), stopping book bans (Education), and implementing ranked choice voting (Electoral Reform).</p>\n  <h3>Conclusion</h3>\n  <p>Thank you for taking the time to review my application for this position. I’m confident that my experience, emotional intelligence, and diligence will make me an ideal candidate for the role.<br></p>\n",
    why: "<div>\n\n<h2>Why I'm Running</h2>\n\n<p>My name is Peter Healy and I am running for City Council as an Independent. I am an Environmental Scientist, Yoga Teacher, Home Parent, and have volunteered with Small World Yoga for almost 5 years, teaching free yoga classes in Davidson County schools and to inmates in the Davidson County prison system. </p>\n\n<p>I'm running because I am tired of watching our political system squeeze out and steamroll the marginalized and the voiceless while cow towing to corporate special interest who dump money into their campaigns and capitol hill lobbyists . I am tired of watching the system work to make the rich get richer as opposed to allowing the rising tide in Nashville to lift all ships. I'm tired of hearing partisan idealogues shouting into the abyss of their own echo chambers, widening the political chasm that's getting harder and harder to bridge and making real change more hypothetical than pragmatic. It's time for me to step into the arena, to be the change I wish to see, and to dismantle the broken, corrupt, and insular system that no longer represents and advocates for the very people it was designed to serve.</p>\n\n<h3>Know your enemy...</h3>\n\n<p>Discomfort is the only way through our current debacle. If we can ride out the discomfort to seek a middle ground, we can abolish the resentment, the demonization, and the dehumanization that each side's most extreme and&nbsp; voices have been proliferating. If we want to save our democracy, it starts with knowing your \"enemy.\" You cannot hate up close.&nbsp; To find compromise, we must listen and understand all of our constituent's view points, and fall back on the fact that there's more that unites us than divides us.&nbsp; East Nashvillians know best that what our community needs most is a tomato, \"- A Uniter, Not A Divider!\"</p>\n\n<h3>My Experience</h3>\n\n<p> I am an experienced and driven leader with a longstanding commitment to and proven track record of organizing communities around unifying causes. I've spent years working in the food and agriculture space, ranging from farm management to food security program management, making healthy food more accessible to forgotten communities.&nbsp; Moreover, I spent the first few years of my career as an Environmental Scientist, remediating contamination left behind by refineries and power plants.&nbsp;</p>\n\n<p>As a home parent, I pursued a 200-Hour Yoga Teacher Training certificate as a way to continue my own personal growth outside of the workplace. With this self inquiry has come a whole new perspective on the world I want to leave behind for my sons, and I can think of no better example I would like to set for them than working to make the system of government work for everyone in our community.</p>\n\n<h3>My Priorities (connect my \"why\" to each policy bucket)</h3>\n\n<ul>\n<li><strong>Fix Roads and Bridges (Transportation): </strong>Improving our infrastructure is crucial to our city's growth and success.</li>\n<li><strong>Pro Choice (Abortion): </strong> No one wants to make the difficult decision to end a pregnancy, and no one is relying on abortion as a form of birth control. This healthcare decision should only be made with the careful consideration of the mother and her healthcare team. The government has no right to tell a woman what to do with her body.</li>\n<li><strong>Stop Book Bans (Education): </strong>We cannot allow our schools to become censored echo chambers.</li>\n<li><strong>Ranked Choice Voting (Electoral Reform): </strong>This system promotes fairness and diversity in our democracy.</li>\n<li><strong>Stop Gerrymandering (Electoral Reform): </strong>We cannot allow politicians to choose their voters. It's time for voters to choose their politicians.</li>\n<li><strong>Affordable Housing (Housing): </strong>Everyone deserves a safe, affordable place to call home. We need more affordable housing options in our community.</li>\n</ul>\n\n</div>",
    policyPlatform:
      '<div class="text-center">\n  <h2 class="text-2xl font-bold">Peter Healy\'s Policy Platform</h2>\n</div>\n\n<div>\n  <h3 class="text-lg font-bold mb-2">1. Fix Roads and Bridges</h3>\n  <ul class="list-disc ml-5 mb-2">\n    <li>Invest in infrastructure improvements to ensure safe and efficient transportation</li>\n    <li>Collaborate with local communities and businesses to prioritize necessary repairs and upgrades</li>\n    <li>Promote sustainable development and transportation options, such as bike lanes and public transit</li>\n  </ul>\n  \n  <h3 class="text-lg font-bold mb-2">2. Pro Choice</h3>\n  <ul class="list-disc ml-5 mb-2">\n    <li>Support a woman\'s right to make her own reproductive healthcare decisions</li>\n    <li>Advocate for access to comprehensive reproductive healthcare services, including birth control and abortion</li>\n    <li>Fight against any attempts to restrict or ban access to reproductive healthcare services</li>\n  </ul>\n  \n  <h3 class="text-lg font-bold mb-2">3. Stop Book Bans</h3>\n  <ul class="list-disc ml-5 mb-2">\n    <li>Defend intellectual freedom and the right to access diverse perspectives and ideas</li>\n    <li>Champion the protection of First Amendment rights and freedom of speech</li>\n    <li>Oppose censorship and the banning of books or other forms of written or artistic expression</li>\n  </ul>\n  \n  <h3 class="text-lg font-bold mb-2">4. Ranked Choice Voting</h3>\n  <ul class="list-disc ml-5 mb-2">\n    <li>Promote electoral reform efforts, such as ranked choice voting, to ensure fair and representative elections</li>\n    <li>Support transparency in the electoral process and increased voter participation</li>\n    <li>Encourage collaboration and compromise among candidates and elected officials</li>\n  </ul>\n  \n</div>\n\n<div>\n  <h2 class="text-lg font-bold mt-5">Top 3 Issues in Zip Code 37206</h2>\n  <ol class="list-decimal ml-5">\n    <li>Affordable housing and gentrification</li>\n    <li>Criminal justice reform and community safety</li>\n    <li>Access to quality healthcare and mental health services</li>\n  </ol>\n</div>',
  },
  goals: {
    filedStatement: 'no',
    campaignCommittee: '',
    electionDate: '2023-08-03',
    runningAgainst: [
      {
        name: 'Clay Capp',
        description:
          'Clay was born and raised in Nashville. His mom was a special education teacher with Metro Schools, and he spent much of his childhood in Nashville’s neighborhood parks and libraries. He even got his start in community service at Metro Parks, planting trees and improving signage at Centennial Park for his Eagle Scout service project.\n\nClay graduated from Harvard in 2006 and the University of Pennsylvania Law School in 2010. He started his career at New York’s Legal Aid Society, representing young people in the Bronx, and has worked in the public interest sector ever since. While at Legal Aid, he was lead counsel in the matter of J.D. v Hansell, et al., which successfully challenged New York City’s parole revocation system for young people. Leading to basic reforms, the victory in that case was featured on the front page of the New York Law Journal.\n\n\nBut Clay was called back to his hometown of Nashville, with his wife Ali, to raise their two young children in the city they love. They live in the East Nashville neighborhood of Lockeland Springs, and they are a Metro Schools family. Clay has served as the Legal Director for the Tennessee Justice Center, and is currently on staff at the Metro Nashville Public Defender’s Office. He is on the board of the Lockeland Springs Neighborhood Association, and is a member of Friends of Shelby Park and Bottoms.\n\nDistrict 6 is a special part of Nashville—neighborly, with the city’s best park, and local businesses that are actually local—but we still need improvements to our infrastructure, green space, and resiliency, and our city still lags in funding for our public schools.\nI am running for Council because, as much as Nashville has changed since I was a kid, we need to work for a future that is affordable, equitable, and green. That means both re-focusing on the basics of city government, day-to-day, and long-range planning for a safe and sustainable future.',
        party: 'Other',
      },
      {
        name: 'Daniel McDonnell',
        description:
          'My name is Daniel McDonell, and I am running to represent East Nashville’s District 6 on Metro Nashville City Council. My wife Katherine and I chose East Nashville to be our home because of the people. We decided to start a family here and raise our two daughters, Ailsa and Fiona, because of the people. As a father, husband, advocate, and urban planner focused on sustainability, I want to use my experience and expertise to ensure the people of East Nashville and our homes have strong representation on the local level.\n\nThe vibrancy and diversity of our neighborhood makes it warm and welcoming, caring and creative. East Nashvillians wave to our neighbors and invite them onto the porch for coffee or a beer. We plant trees, and we support our parks and environment. We enjoy our walkable neighborhoods and our local shops. We support the artists, musicians, and venues that keep us imaginative and unique. And when natural disaster tries to tear us apart, we band together to build our community stronger than before. These are the qualities that I cherish in our community and those that help our neighbors old and new to grow our roots here.\n\nThe Council Member is a champion for East Nashville. I want to get to know you and learn from you what you love about the neighborhood, and I want to know your ideas about how we can make the neighborhood even better. Come on over for coffee sometime- let’s talk and keep our community roots growing.\n\nMy wife Katherine and I grew up down the road in Memphis. I went to college at Northwestern University where I studied Religion, Geography, and Environmental Policy, and then I went on to study Environmental Sustainability for graduate school in Glasgow, Scotland. When we moved back to Tennessee nine years ago, we chose East Nashville as the place we wanted to start our careers and our family, with Katherine as a physician at Vanderbilt and me diving into the non-profit community in Nashville. Our family has grown up here with two daughters, Ailsa, 4, and Fiona, 1, two rescue dogs, and a few backyard chickens.\n\nI worked as a policy and education manager for Walk Bike Nashville, advocating for sustainable transportation and safer streets in Nashville at a time of rapid change in the city, and I went on to work in the Planning Department for Metro Nashville, continuing to promote better transportation through development and new walking, bicycling, and transit initiatives. I currently manage the Multimodal Planning Office at the Tennessee Department of Transportation, where I have worked with the City of Nashville to initiate significant pedestrian and transit improvements right here in East Nashville. I serve as a volunteer and Board President for the Shelby Hills Neighborhood Association, and I continue to serve Walk Bike Nashville as an Executive Board Member.',
        party: 'Other',
      },
    ],
  },
  pathToVictory: {
    totalRegisteredVoters: '14231',
    projectedTurnout: '3316',
    winNumber: 1691,
    republicans: '1160',
    democrats: '6930',
    indies: '6231',
    averageTurnout: '3316',
    ageMin: '',
    ageMax: 0,
    women: '7681',
    men: '6637',
    africanAmerican: 0,
    white: 0,
    asian: 0,
    hispanic: 0,
    voteGoal: '1750',
    voterProjection: 0,
    budgetLow: 0,
    budgetHigh: 0,
  },
};
