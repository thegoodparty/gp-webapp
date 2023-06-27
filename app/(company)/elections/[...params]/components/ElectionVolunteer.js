import Image from 'next/image';
import MaxWidth from '@shared/layouts/MaxWidth';
import EmailForm from '@shared/inputs/EmailForm';
// import CandidatePill from '/app/candidate/[slug]/components/CandidatePill';

export default function ElectionVolunteer(props) {
  const { content } = props;

  return (
    <>
      <MaxWidth>
        <div className="grid grid-cols-12 gap-3 md:justify-items-center pt-10 bg-slate-50">
          <div className="col-span-12 lg:col-span-7 lg:pl-20 max-w-2xl p-10">
            <button className="bg-[#F54966] bg-opacity-20 text-red-500 py-2 px-6 no-underline rounded-full font-normal  btn-primary">
              Volunteer
            </button>

            <h1 className="text-[32px] md:text-[64px] font-semibold mt-3">
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
          <div className="col-span-12 lg:col-span-5 relative w-full h-full lg:pt-10 items-center">
            <div className="flex flex-row justify-center">
              <Image
                src="/images/elections/volunteer1.png"
                width={239}
                height={366}
                alt=""
                className="hidden md:block"
              />
              <Image
                src="/images/elections/volunteer2.png"
                width={239}
                height={366}
                alt=""
                className="md:ml-3"
              />
            </div>
          </div>
        </div>

        <div className="flex text-center justify-center w-full pt-20">
          <span className="text-indigo-800 text-[40px] font-semibold pb-10">
            Schedule an info session
          </span>
        </div>
      </MaxWidth>
    </>
  );
}
