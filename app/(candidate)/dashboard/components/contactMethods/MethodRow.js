import PrimaryButton from '@shared/buttons/PrimaryButton';
import Body2 from '@shared/typography/Body2';
import H3 from '@shared/typography/H3';
import { BsStars } from 'react-icons/bs';
import { MdLock } from 'react-icons/md';
import LogProgress from './LogProgress';

export default function MethodRow(props) {
  const { method, campaign } = props;
  const { title, description, cta, icon } = method;
  const { isPro } = campaign || {};
  console.log('campaign', campaign);
  return (
    <div className="border border-gray-200 p-4 rounded-lg mt-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-5 flex">
          <div className="mr-4 text-xl mt-1">{icon}</div>
          <div>
            <H3>{title}</H3>
            <Body2 className="mt-1">{description}</Body2>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <PrimaryButton variant="outlined" fullWidth>
                <div className="flex items-center justify-center">
                  <BsStars className="mr-2" />
                  Generate Script
                </div>
              </PrimaryButton>
            </div>
            <div className="col-span-4">
              {isPro ? (
                <PrimaryButton fullWidth>Pro {cta}</PrimaryButton>
              ) : (
                <PrimaryButton fullWidth>
                  <div className="flex items-center justify-center">
                    <MdLock className="mr-2" />
                    {cta}
                  </div>
                </PrimaryButton>
              )}
            </div>
            <div className="col-span-4">
              <LogProgress card={method} {...props} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
