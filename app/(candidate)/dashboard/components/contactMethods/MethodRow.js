import PrimaryButton from '@shared/buttons/PrimaryButton';
import Body2 from '@shared/typography/Body2';
import H3 from '@shared/typography/H3';
import { BsStars } from 'react-icons/bs';
import { MdLock } from 'react-icons/md';
import LogProgress from './LogProgress';
import Link from 'next/link';
import { numberFormatter } from 'helpers/numberHelper';
import ScheduleFlow from '../../voter-records/[type]/components.js/ScheduleFlow';

export default function MethodRow(props) {
  const { method, campaign = {}, pathToVictory = {} } = props;
  const {
    title,
    description,
    cta,
    icon,
    comingSoon,
    voterFileKey,
    perc,
    percText,
    specialCallout,
    showScheduleButton,
  } = method;
  const { isPro } = campaign;
  const { voterContactGoal = 0 } = pathToVictory;
  const perNumber = numberFormatter((voterContactGoal * perc) / 100);

  // Check campaign viability to show special callout
  const hbViability = campaign.data?.hubSpotUpdates?.final_viability_rating;
  const showSpecialCallout =
    specialCallout &&
    typeof hbViability === 'string' &&
    ['has a chance', 'likely to win', 'frontrunner'].includes(
      hbViability.toLowerCase(),
    );

  return (
    <div className="border border-gray-200 p-4 rounded-lg mt-4">
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-12 flex 2xl:col-span-5">
          <div className="mr-4 text-xl mt-1">{icon}</div>
          <div>
            {comingSoon ? (
              <H3>{title}</H3>
            ) : (
              <Link href={`/dashboard/voter-records/${voterFileKey}`}>
                <H3>{title}</H3>
              </Link>
            )}

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
              {showSpecialCallout && (
                <div className="block col-span-12 2xl:hidden">
                  {specialCallout}
                </div>
              )}
              <div className="col-span-12 lg:col-span-4">
                <Link href="/dashboard/content?showModal=true">
                  <PrimaryButton
                    className="!text-base"
                    variant="outlined"
                    fullWidth
                  >
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
                      <PrimaryButton className="!text-base" disabled fullWidth>
                        Coming Soon
                      </PrimaryButton>
                    ) : showScheduleButton ? (
                      <ScheduleFlow
                        type={voterFileKey}
                        customButton={
                          <PrimaryButton className="!text-base !px-3" fullWidth>
                            {cta}
                          </PrimaryButton>
                        }
                      />
                    ) : (
                      <Link href={`/dashboard/voter-records/${voterFileKey}`}>
                        <PrimaryButton className="!text-base !px-3" fullWidth>
                          {cta}
                        </PrimaryButton>
                      </Link>
                    )}
                  </>
                ) : (
                  <Link href="/dashboard/upgrade-to-pro">
                    <PrimaryButton
                      fullWidth
                      className="!text-base !px-2 pro-upgrade-tracker flex items-center justify-center gap-1"
                    >
                      <MdLock />
                      {cta}
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
      {showSpecialCallout && (
        <div className="hidden 2xl:block mt-4">{specialCallout}</div>
      )}
    </div>
  );
}
