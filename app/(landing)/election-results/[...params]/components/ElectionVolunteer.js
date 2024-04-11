'use client';
import Image from 'next/image';
import MaxWidth from '@shared/layouts/MaxWidth';
import EmailForm from '@shared/inputs/EmailForm';
import WarningButton from '@shared/buttons/WarningButton';
import volunteerImg1 from '/public/images/election-results/volunteer1.png';
import volunteerImg2 from '/public/images/election-results/volunteer2.png';
import meetingImg from '/public/images/election-results/meeting.jpg';

// import CandidatePill from '/app/candidate/[slug]/components/CandidatePill';

export default function ElectionVolunteer(props) {
  const { content, handleOpenModal } = props;

  return (
    <>
      <MaxWidth>
        <div className="grid grid-cols-12 gap-3 md:justify-items-center pt-10 bg-indigo-50">
          <div className="col-span-12 lg:col-span-7 lg:pl-20 max-w-2xl p-10">
            <button className="bg-[#F54966] bg-opacity-20 text-red-500 py-2 px-6 no-underline rounded-full font-normal  btn-primary">
              Volunteer
            </button>

            <h1 className="text-[32px] md:text-[64px] leading-[32px] md:leading-[72px] font-semibold mt-3">
              Help independent candidates run and win
            </h1>
            <h2 className="text-lg font-sfpro font-normal leading-6 mt-5 max-w-md">
              We&apos;re organizing a community to realize our collective power
              to elect promising independent candidates and fix our broken
              system.
            </h2>
            <div className="max-w-md">
              <EmailForm
                formId="5d84452a-01df-422b-9734-580148677d2c"
                pageName={content.slug}
                labelId="subscribe-form"
                label="Join us"
              />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5 relative w-full h-full lg:pt-10 flex items-center justify-center">
            <div className="flex flex-row justify-center items-center">
              <Image src={volunteerImg1} alt="" className="hidden md:block" />
              <Image src={volunteerImg2} alt="" className="md:ml-3" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3 md:justify-items-center pt-10 bg-indigo-50 items-center md:mb-20">
          <div className="col-span-12 lg:col-span-7 relative w-full h-full lg:pt-10 lg:pl-20 max-w-2xl p-10 items-center">
            <div className="flex flex-row justify-center">
              <Image src={meetingImg} alt="" className="rounded-xl" />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 max-w-2xl md:mb-5 order-first md:order-last items-center">
            <h2 className="text-[32px] md:text-[64px] leading-[32px] md:leading-[72px] font-semibold mt-3">
              Schedule a virtual info session
            </h2>
            <h2 className="text-lg font-sfpro font-normal leading-6 mt-5 max-w-md">
              Meet with us to learn about joining the movement to help make
              people matter more than money in politics.
            </h2>
            <div className="pt-10">
              <div onClick={handleOpenModal} id="election-demo-btn">
                <WarningButton>Schedule info session</WarningButton>
              </div>
            </div>
          </div>
        </div>
      </MaxWidth>
    </>
  );
}
