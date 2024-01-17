import YellowButton from '@shared/buttons/YellowButton';
import { RxExternalLink } from 'react-icons/rx';

export default function QuickLinks() {
  return (
    <div className="mb-10 lg:mb-20 px-5 lg:ml-20">
      <h4 className="text-2xl font-medium mb-4">QUICK LINKS</h4>
      <div className="flex ">
        <a
          href="https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online"
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="mr-4"
        >
          <YellowButton>
            <div className="flex items-center">
              <div className="font-normal mr-2">EIN Government website</div>
              <RxExternalLink />
            </div>
          </YellowButton>
        </a>
        <a
          href="https://stripe.com/"
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          <YellowButton>
            <div className="flex items-center">
              <div className="font-normal mr-2">Stripe</div>
              <RxExternalLink />
            </div>
          </YellowButton>
        </a>
      </div>
    </div>
  );
}
