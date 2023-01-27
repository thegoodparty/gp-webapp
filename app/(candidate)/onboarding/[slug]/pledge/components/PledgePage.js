import CmsContentWrapper from '@shared/content/CmsContentWrapper';
import PortalPanel from '@shared/layouts/PortalPanel';
import contentfulHelper from 'helpers/contentfulHelper';
import OnboardingWrapper from '../../../shared/OnboardingWrapper';
import PledgeButton from './PledgeButton';

export default function PledgePage(props) {
  return (
    <OnboardingWrapper {...props}>
      <PortalPanel color="#ea580c" smWhite>
        <h3 className="font-black text-xl italic mb-8">Good Party Pledge</h3>
        <CmsContentWrapper>
          {contentfulHelper(props.content?.content)}
        </CmsContentWrapper>
        <PledgeButton {...props} />
      </PortalPanel>
    </OnboardingWrapper>
  );
}
