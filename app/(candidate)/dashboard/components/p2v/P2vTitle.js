import SecondaryButton from '@shared/buttons/SecondaryButton';
import Body2 from '@shared/typography/Body2';
import H2 from '@shared/typography/H2';

export function P2vTitle(props) {
  return (
    <div className="lg:flex justify-between">
      <div className="">
        <H2>Path to Victory</H2>
        <Body2 className=" text-gray-600">
          Understand your campaign phase, tactics, and overall voter contact
          progress.
        </Body2>
      </div>
      <div className="mt-4 lg:mt-0">
        <SecondaryButton fullWidth variant="outlined">
          Understanding Path to Victory
        </SecondaryButton>
      </div>
    </div>
  );
}
