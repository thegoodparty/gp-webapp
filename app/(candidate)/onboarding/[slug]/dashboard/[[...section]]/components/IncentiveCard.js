import { Fragment } from 'react';
import { FaCheck, FaLock } from 'react-icons/fa';
import ColtonImg from 'public/images/people/colton.png';
import RobImg from 'public/images/people/rob.png';
import JaredImg from 'public/images/campaign/jared.jpg';
import Image from 'next/image';
import { BiUser } from 'react-icons/bi';
import Link from 'next/link';
import ScheduleModal from './ScheduleModal';

const WrapperElement = ({ link, status, children }) => {
  if (status === 'locked' || !link) {
    return <div>{children}</div>;
  }
  return <Link href={link}>{children}</Link>;
};

export default function IncentiveCard({ step, campaign, campaignStatus }) {
  const { slug, image } = campaign;
  const { key, icon, title, connectedLine } = step;
  const stepStatus = campaignStatus[step.key];
  const status = stepStatus?.status;

  let imgSrc;
  if (key === 'support') {
    imgSrc = JaredImg;
  } else if (key === 'socialSupport') {
    imgSrc = ColtonImg;
  } else if (key === 'financeSupport') {
    imgSrc = RobImg;
  } else if (key === 'profile' && image) {
    imgSrc = image;
  }

  let link = '';
  if (key === 'profile') {
    link = `/candidate/${slug}/edit`;
  }

  return (
    <Fragment key={key}>
      <div className="col-span-1 lg:hidden"></div>
      <div className="col-span-10 lg:col-span-3 h-full">
        <div className="relative lg:h-[80%] lg:mt-[10%]">
          <div
            className={`relative  px-4 py-5 rounded-[32px] z-10 h-full transition-shadow hover:shadow-lg ${
              status === 'locked' ? 'bg-black text-white' : ' bg-gp-yellow'
            }`}
          >
            <div className="flex justify-between items-start">
              <div
                className={`w-11 inline-block py-2 px-3 rounded-full text-lg ${
                  status === 'locked' ? 'text-gp-yellow' : ' text-black'
                }  ${
                  status === 'locked'
                    ? 'bg-white bg-opacity-20'
                    : ' bg-black bg-opacity-10'
                }`}
              >
                {icon}
              </div>
              <div>
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    height={56}
                    width={56}
                    alt={key}
                    className={`rounded-full object-cover object-center h-14 w-14 ${
                      status === 'locked' && 'mt-5'
                    }`}
                  />
                ) : (
                  <div
                    className={`text-black text-2xl w-14 h-14 rounded-full  flex items-center justify-center bg-slate-300  ${
                      status === 'locked' && 'mt-5'
                    }`}
                  >
                    <BiUser />
                  </div>
                )}
              </div>
              <div className="w-11">
                {status === 'locked' ? (
                  <div className="bg-gp-yellow text-black  inline-block py-2 px-3 rounded-full">
                    <FaLock />
                  </div>
                ) : (
                  <div className="bg-black text-gp-yellow  inline-block py-2 px-3 rounded-full">
                    <FaCheck />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-1 font-bold text-lg h-14 flex items-center justify-center text-center">
              {title}
            </div>
            {status !== 'locked' && (
              <>
                {key === 'support' ? (
                  <ScheduleModal campaign={campaign} />
                ) : (
                  <div className="text-sm text-center underline mt-1">
                    <Link href={link}>View {key}</Link>{' '}
                  </div>
                )}
              </>
            )}
          </div>
          {key !== 'financeSupport' && (
            <div
              className={`absolute z-0 bg-black opacity-10 -bottom-12 left-1/2 -ml-2.5 w-5 h-14 lg:top-1/2 lg:left-auto lg:-right-[34px] lg:-mt-5 lg:ml-0 lg:rotate-90 ${
                !connectedLine && 'lg:hidden'
              }`}
            ></div>
          )}
        </div>
      </div>
      <div className="col-span-1 lg:hidden"></div>
    </Fragment>
  );
}
