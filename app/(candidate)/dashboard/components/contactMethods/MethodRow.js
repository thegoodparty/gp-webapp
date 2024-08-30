import PrimaryButton from '@shared/buttons/PrimaryButton';
import Body2 from '@shared/typography/Body2';
import H3 from '@shared/typography/H3';
import { BsStars } from 'react-icons/bs';
import { MdLock } from 'react-icons/md';
import LogProgress from './LogProgress';
import Link from 'next/link';
import { numberFormatter } from 'helpers/numberHelper';

export default function MethodRow(props) {
  const { method, campaign, pathToVictory } = props;
  const {
    title,
    description,
    cta,
    icon,
    comingSoon,
    voterFileKey,
    perc,
    percText,
  } = method;
  const { isPro } = campaign || {};

  let { voterContactGoal } = pathToVictory || {};
  voterContactGoal = voterContactGoal || 0;
  const perNumber = numberFormatter((voterContactGoal * perc) / 100);

  return (
    <div className="border border-gray-200 p-4 rounded-lg mt-4">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12  flex  2xl:col-span-5">
          <div className="mr-4 text-xl mt-1">{icon}</div>
          <div>
            <H3>{title}</H3>
            <Body2 className="mt-1">
              {description}{' '}
              <strong>
                ({perNumber} {percText})
              </strong>
            </Body2>
          </div>
        </div>

        <div className="col-span-12  2xl:col-span-7 2xl:flex 2xl:justify-end">
          <div className="2xl:w-[800px]">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 lg:col-span-4">
                <Link href="/dashboard/content?showModal=true">
                  <PrimaryButton variant="outlined" fullWidth>
                    <div className="flex items-center justify-center generate-script">
                      <BsStars className="mr-2" />
                      Generate Script
                    </div>
                  </PrimaryButton>
                </Link>
              </div>
              <div className="col-span-12 lg:col-span-4">
                {isPro ? (
                  <>
                    {comingSoon ? (
                      <PrimaryButton disabled fullWidth>
                        Coming Soon
                      </PrimaryButton>
                    ) : (
                      <Link href={`/dashboard/voter-records/${voterFileKey}`}>
                        <PrimaryButton fullWidth>{cta}</PrimaryButton>
                      </Link>
                    )}
                  </>
                ) : (
                  <Link href="/dashboard/upgrade-to-pro">
                    <PrimaryButton fullWidth className="pro-upgrade-tracker">
                      <div className="flex items-center justify-center">
                        <MdLock className="mr-2" />
                        {cta}
                      </div>
                    </PrimaryButton>
                  </Link>
                )}
              </div>
              <div className="col-span-12 lg:col-span-4">
                <LogProgress card={method} {...props} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
