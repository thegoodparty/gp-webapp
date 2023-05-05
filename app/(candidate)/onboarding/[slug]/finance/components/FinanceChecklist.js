'use client';
import { Checkbox } from '@mui/material';
import YellowButton from '@shared/buttons/YellowButton';
import YellowButtonClient from '@shared/buttons/YellowButtonClient';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import Image from 'next/image';
import { Fragment, useEffect, useState } from 'react';
import { FaChevronDown, FaExclamation } from 'react-icons/fa';
import FinanceDisclaimer from './FinanceDisclaimer';
import QuickLinks from './QuickLinks';

const fields = [
  {
    key: 'ein',
    title: 'File for an EIN with the IRS',
    subTitle: 'To file for an EIN with the IRS, follow these steps:',
    steps: [
      {
        title: "Determine your campaign's legal structure:",
        description:
          'Your campaign may be set up as a sole proprietorship, partnership, corporation, or another type of legal entity. Consult with a legal or tax professional to determine the most appropriate structure for your campaign.',
      },
      {
        title: 'Visit the IRS website:',
        description: (
          <>
            Go to the IRS EIN Assistant (
            <a
              href="https://www.irs.gov/ein"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="font-medium underline"
            >
              https://www.irs.gov/ein
            </a>
            ) to start the online EIN application process. The application is
            available Monday through Friday, 7 a.m. to 10 p.m. Eastern Time.
          </>
        ),
      },
      {
        title: 'Complete the online application:',
        description:
          "Fill out the required information, including your campaign's legal structure, personal information, and contact details. You'll also need to provide the reason for applying for an EIN, such as starting a new campaign or hiring employees.",
      },
      {
        title: 'Review and submit the application:',
        description:
          'Double-check your application for accuracy before submitting it. If your application is complete and error-free, you will receive your EIN immediately after submission.',
      },
      {
        title: 'Keep a record of your EIN:',
        description:
          'Once you have your EIN, store it in a secure location and use it for all future financial and tax-related activities related to your campaign.',
      },
    ],
  },
  {
    key: 'management',
    title: 'Financial management',
    subTitle: 'Open your account(s), accept donations',
    steps: [
      {
        title: 'Open a campaign checking account',
        description:
          'This should be separate from your personal financial account(s).',
      },
      {
        title: 'Open a payment processor account for online fundraising',
        description: 'Try Stripe or Anedot',
      },
      {
        title: 'Embed a donate button into your website',
        description: '',
      },
    ],
  },
  {
    key: 'regulatory',
    title:
      'Research and file necessary paperwork with relevant campaign regulatory agency',
    subTitle:
      'Crucial for establishing your campaign as a legal entity and ensuring compliance with federal, state, and local campaign finance laws',
    steps: [
      {
        title: 'Determine the relevant regulatory agency:',
        description:
          'Identify the agency responsible for overseeing campaign finance laws and regulations for the office you are seeking. This may vary based on whether you are running for federal, state, or local office.',
      },
      {
        title: 'Research filing requirements:',
        description:
          "Visit the official website of the relevant regulatory agency to review the filing requirements and deadlines for your campaign. This may include registering your campaign, filing a statement of candidacy, designating a campaign committee, or disclosing your campaign's financial activity.",
      },
      {
        title: 'Familiarize yourself with campaign finance laws:',
        description:
          'Study the campaign finance laws and regulations that apply to your campaign, including contribution limits, disclosure requirements, and reporting deadlines. It is crucial to have a clear understanding of these laws to avoid any potential legal issues.',
      },
      {
        title: 'Prepare the required paperwork:',
        description:
          'Based on the information gathered in steps 2 and 3, compile the necessary forms and documents required by the relevant regulatory agency. Ensure that all information provided is accurate, complete, and up-to-date.',
      },
      {
        title: 'Consult with a legal or compliance expert:',
        description:
          'Consider seeking guidance from a legal or compliance expert familiar with campaign finance laws and regulations. They can help review your paperwork and advise on any necessary adjustments to ensure compliance.',
      },
      {
        title: 'File the paperwork:',
        description:
          "Submit the required paperwork to the appropriate campaign regulatory agency by the specified deadline. Keep copies of all submitted documents and track your filing status through the agency's online portal or by contacting the agency directly.",
      },
      {
        title: 'Stay informed and up-to-date:',
        description:
          'Continuously monitor any changes to campaign finance laws and regulations that may impact your campaign. Update and submit any additional paperwork as needed to maintain compliance with these evolving requirements.',
      },
    ],
  },
  {
    key: 'filing',
    title: 'Identify and mark down key campaign filing and finance deadlines',
    subTitle:
      "Manage your campaign's financial activities more effectively, maintain transparency, and avoid potential legal issues",
    steps: [
      {
        title: 'Determine the relevant regulatory agencies:',
        description:
          'Identify the agencies responsible for overseeing campaign finance laws and regulations for the office you are seeking. This may vary based on whether you are running for federal, state, or local office.',
      },
      {
        title: 'Research filing and finance deadlines:',
        description:
          "Visit the official websites of the relevant regulatory agencies to find information on key deadlines, such as registering your campaign, filing financial reports, disclosing contributions, and submitting other required paperwork. Be aware that deadlines may vary depending on the election cycle, the office you are seeking, and your campaign's specific circumstances.",
      },
      {
        title: 'Create a comprehensive calendar:',
        description:
          'Compile all identified deadlines into a single, comprehensive calendar. This can be a physical calendar, a digital calendar, or a project management tool that allows you to set reminders and notifications for upcoming deadlines.',
      },
      {
        title: 'Prioritize deadlines:',
        description:
          'Some deadlines are more critical than others, so prioritize them accordingly. For example, deadlines related to candidate registration or financial disclosures may carry greater consequences if missed, so ensure these are clearly marked and given priority.',
      },
      {
        title: 'Assign responsibilities:',
        description:
          'Delegate tasks related to meeting filing and finance deadlines to your campaign treasurer, compliance manager, or other team members as appropriate. Make sure everyone is aware of their responsibilities and the importance of meeting these deadlines.',
      },
      {
        title: 'Set reminders and notifications:',
        description:
          'Use your calendar or project management tool to set up reminders and notifications for all key deadlines. These should be scheduled well in advance to give your team enough time to prepare and submit the necessary paperwork.',
      },
      {
        title: 'Monitor and update deadlines:',
        description:
          'Continuously monitor any changes in filing and finance deadlines that may impact your campaign. Update your calendar accordingly and communicate any changes to your team members.',
      },
      {
        title: 'Conduct regular check-ins:',
        description:
          'Hold regular check-ins with your team members responsible for meeting deadlines to ensure progress is being made and any issues or concerns are addressed promptly.',
      },
    ],
  },
];

const initialState = {};
fields.forEach((field) => {
  initialState[field.key] = false;
});

export default function FinanceChecklist({ campaign }) {
  const { slug } = campaign;
  const [selected, setSelected] = useState(false);
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (campaign.finance) {
      setState(campaign.finance);
    }
  }, []);

  const handleSelect = (index) => {
    if (selected === index) {
      setSelected(false);
    } else {
      setSelected(index);
    }
  };

  const onChangeField = async (key, value) => {
    const updated = {
      ...state,
      [key]: value,
    };
    setState(updated);

    const trueOnly = {};
    for (const [key, value] of Object.entries(updated)) {
      if (value) {
        trueOnly[key] = true;
      }
    }

    await updateCampaign({
      ...campaign,
      finance: trueOnly,
    });
  };

  const canSave = () => {
    return state.ein && state.management && state.regulatory && state.filing;
  };
  const handleSave = async () => {
    await updateCampaign({
      ...campaign,
      finance: state,
    });
    window.location.href = `/onboarding/${slug}/dashboard`;
  };

  return (
    <>
      <div className="lg:mt-6 pt-5 lg:pt-10 bg-white rounded-2xl">
        <div>
          <div class="font-bold mb-10 text-2xl px-6 lg:px-10">
            Let&apos;s get your finances in order
          </div>
          <div className="text-lg max-w-3xl font-light px-6 lg:px-10">
            Setting up accounts and coming up with a plan to manage your money
            can be daunting; we get it. That&apos;s why we&apos;ve broken down
            the most important parts into easily manageable steps. Click into
            each section to get started and learn more:
          </div>
        </div>
        <div className="pt-14 lg:pt-28">
          <div className="bg-slate-100 h-1" />
          {fields.map((field, index) => (
            <Fragment key={field.key}>
              <div className="py-6 flex items-start justify-between">
                <div className="text-right lg:text-center w-11 pl-2 lg:pl-0 shrink-0 lg:w-[180px] -mt-2">
                  <Checkbox
                    sx={{
                      '&.Mui-checked': { color: '#FFE600' },
                      '& .MuiSvgIcon-root': { fontSize: 50 },
                    }}
                    checked={state[field.key]}
                    onChange={(e) => onChangeField(field.key, e.target.checked)}
                  />
                </div>
                <div className="hidden lg:block bg-slate-100 w-1 h-10  shrink-0"></div>
                <div
                  className="flex-1 pl-4 lg:pl-7 cursor-pointer"
                  onClick={() => handleSelect(index)}
                >
                  <h3 className="font-bold text-lg lg:text-2xl mb-1 ml-4 lg:ml-0">
                    {field.title}
                  </h3>
                  <div className="text-sm lg:text-lg font-light ml-4 lg:ml-0">
                    {field.subTitle}
                  </div>
                  {selected === index && (
                    <div
                      className="-ml-14 lg:ml-0 mt-10 lg:my-16 cursor-default"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {field.steps.map((step, index) => (
                        <div
                          key={step.title}
                          className={`flex ${index === 0 ? 'mt-14' : 'mt-7'}`}
                        >
                          <div className="bg-black rounded-full inline-flex items-center justify-center mr-4 lg:mr-10 text-white text-lg lg:text-3xl font-bold ml-8 lg:ml-0  h-10 w-10 lg:h-14 lg:w-14 shrink-0">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-lg lg:text-2xl underline mb-2">
                              {step.title}
                            </h4>
                            <div className="font-light text-base lg:text-xl">
                              {step.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div
                  className="pr-4 lg:pr-14 pl-4 shrink-0 cursor-pointer"
                  onClick={() => handleSelect(index)}
                >
                  <div
                    className={`transition-all duration-300 ${
                      index === selected && 'rotate-180'
                    }`}
                  >
                    <div className="text-[#EA8A6B] lg:bg-[#EA8A6B] lg:rounded-full lg:w-14 lg:h-14 lg:flex items-center justify-center lg:text-white lg:mt-2">
                      <FaChevronDown size={24} />
                    </div>
                  </div>
                </div>
              </div>
              {selected === 0 && index === 0 && <FinanceDisclaimer />}
              {selected === 3 && index === 3 && <QuickLinks />}

              <div className="bg-slate-100 h-1" />
            </Fragment>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a href={`/onboarding/${slug}/dashboard`}>
            <YellowButtonClient disabled={!canSave()} onClick={handleSave}>
              <strong>CONTINUE</strong>
            </YellowButtonClient>
          </a>
        </div>
        <div className="mt-14 italic max-w-4xl px-3 lg:pl-12 pb-9 font-light">
          <u>Disclaimer</u>: The information provided on this website does not,
          and is not intended to, constitute legal advice. All information,
          content, and materials available on this site are for general
          informational purposes only.
        </div>
      </div>
    </>
  );
}
