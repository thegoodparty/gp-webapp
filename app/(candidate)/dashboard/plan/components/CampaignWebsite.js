import Body2 from '@shared/typography/Body2';
import H3 from '@shared/typography/H3';
import ListItem from '@shared/utils/ListItem';
import TogglePanel from '@shared/utils/TogglePanel';

const websiteSteps = [
  {
    title: 'Design a user-friendly website',
    description:
      "Your website should be visually appealing  and showcase the candidate's platform, accomplishments, and personal story.",
  },
  {
    title: 'SEO',
    description:
      'Optimize the website for search engines (SEO) to increase visibility and organic traffic.',
  },
  {
    title: 'Mobile-friendly',
    description:
      'Ensure mobile responsiveness to cater to users on various devices.',
  },
  {
    title: 'CTAs',
    description:
      'Include a clear call-to-action for donations, volunteer sign-ups, and newsletter subscriptions.',
  },
  {
    title: 'Regular updates',
    description:
      'Regularly update the website with blog posts, news articles, and multimedia content to maintain voter engagement.',
  },
];

export default function CampaignWebsite(props) {
  return (
    <div>
      <TogglePanel
        label="Campaign Website"
        icon="/images/dashboard/website-icon.svg"
      >
        <div className="bg-slate-50 rounded-xl py-5 px-7">
          <H3>Build a Campaign Website</H3>
          <Body2 className="mt-2 mb-6">
            Your online presence is an important part of your campaign strategy.
            Here are some helpful tips for building a good campaign site.
          </Body2>
          {websiteSteps.map((step, index) => (
            <ListItem key={step.title} title={step.title} number={index + 1}>
              {step.description}
            </ListItem>
          ))}
        </div>
      </TogglePanel>
    </div>
  );
}
