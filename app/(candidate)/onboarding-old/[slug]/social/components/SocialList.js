import YellowButton from '@shared/buttons/YellowButton';
import { Fragment } from 'react';

export const websiteSteps = [
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
export default function SocialList({ slug }) {
  return (
    <>
      <div className="lg:mt-6 pt-5 lg:pt-10 bg-white rounded-2xl">
        <div>
          <div className="font-bold mb-10 text-2xl px-6 lg:px-10">
            Building a good campaign website
          </div>
          <div className="text-lg max-w-3xl font-light px-6 lg:px-10">
            Your online presence is an important part of your campaign strategy.
            Here are some helpful tips for building a good campaign site.
          </div>
        </div>
        <div className="pt-14 lg:pt-20">
          <div className="bg-slate-100 h-1" />
          {websiteSteps.map((step, index) => (
            <Fragment key={step.title}>
              <div className="py-6 flex items-center">
                <div className="text-right lg:text-center w-16 shrink-0 lg:w-[180px] font-bold text-5xl lg:text-6xl">
                  {index + 1}
                </div>
                <div className="hidden lg:block bg-slate-100 w-1 h-10 mr-14 shrink-0"></div>
                <div>
                  <h3 className="font-bold text-lg lg:text-2xl mb-1 ml-4 lg:ml-0">
                    {step.title}
                  </h3>
                  <div className="text-sm lg:text-lg font-light ml-4 lg:ml-0">
                    {step.description}
                  </div>
                </div>
              </div>
              <div className="bg-slate-100 h-1" />
            </Fragment>
          ))}
        </div>
      </div>
      <div className="mt-12 text-center">
        <a href={`/onboarding/${slug}/1`}>
          <YellowButton>CONTINUE</YellowButton>
        </a>
      </div>
    </>
  );
}
