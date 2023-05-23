import Body2 from '@shared/typography/Body2';
import H3 from '@shared/typography/H3';
import ListItem from '@shared/utils/ListItem';
import TogglePanel from '@shared/utils/TogglePanel';
import { websiteSteps } from 'app/(candidate)/onboarding/[slug]/social/components/SocialList';

export default function SocialPanel(props) {
  return (
    <div>
      <TogglePanel
        label="Build a Campaign Website"
        icon="/images/dashboard/website-icon.svg"
      >
        <div className="bg-slate-50 rounded-xl py-5 px-7">
          <H3>Build a Campaign Website</H3>
          <Body2 className="mt-2 mb-6">
            Your online presence is an important part of your campaign strategy.
            Here are some helpful tips for building a good campaign site.
          </Body2>
          {websiteSteps.map((step, index) => (
            <ListItem ket={step.title} title={step.title} number={index + 1}>
              {step.description}
            </ListItem>
          ))}
        </div>
      </TogglePanel>
    </div>
  );
}
