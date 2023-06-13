import { FaLock } from 'react-icons/fa';
import JaredImg from 'public/images/campaign/jared.jpg';
import Image from 'next/image';
import ScheduleModal from './ScheduleModal';

export default function UnlockJared({ step, nextStep, campaign }) {
  const unlocked =
    step.key === 'incentive' &&
    (nextStep.step > 3 || nextStep.sectionIndex > 0);

  return (
    <div
      className="col-span-12 md:col-span-6 xl:col-span-3 h-full"
      key={step.key}
    >
      <div className=" bg-white rounded-xl h-full flex flex-col justify-between relative">
        <div className="flex justify-center pt-4">
          <Image
            src="/images/heart.svg"
            alt="GP"
            width={56}
            height={56}
            className="block"
          />
        </div>
        {unlocked ? (
          <>
            <div className="px-6 pb-2">
              <h3 className="font-bold text-lg text-center">
                SCHEDULE MEETING{' '}
                <span role="img" aria-label="Party">
                  🎉
                </span>
              </h3>
              <div className="flex items-center mt-3">
                <div className="text-zinc-500 leading-relaxed text-sm pr-2">
                  Schedule a one-on-one session with our Political Director,{' '}
                  <strong>Jared Alper!</strong>
                </div>
                <div>
                  <Image
                    src={JaredImg}
                    height={128}
                    width={128}
                    alt="Jared"
                    className="rounded-full border-4 border-zinc-300"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 pb-2 text-center">
              <ScheduleModal
                campaign={campaign}
                nextStep={nextStep}
                calendar="https://meetings.hubspot.com/jared-alper"
              />
            </div>
          </>
        ) : (
          <>
            <div className="px-6 pb-2">
              <h3 className="font-bold text-lg text-center">
                UNLOCK EXPERT SUPPORT{' '}
                <span role="img" aria-label="Party">
                  🎉
                </span>
              </h3>
              <div className="flex items-center mt-3">
                <div className="text-zinc-500 leading-relaxed text-sm pr-2">
                  Unlock a one-on-one session with our Political Director, Jared
                  Alper!
                </div>
                <div>
                  <Image
                    src={JaredImg}
                    height={128}
                    width={128}
                    alt="Jared"
                    className="rounded-full border-4 border-zinc-300"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center px-6 pb-4 text-sm ">
              <FaLock />
              <div className="pl-2">Access when Pre-Launch completed</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
