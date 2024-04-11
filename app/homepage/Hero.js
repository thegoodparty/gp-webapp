import EmailForm from '@shared/inputs/EmailForm';
import Image from 'next/image';
import bgImg from '/public/images/homepage/art.png';
import MaxWidth from '@shared/layouts/MaxWidth';

export default function Hero() {
  return (
    <MaxWidth>
      <div className="grid grid-cols-12 gap-3 md:justify-items-center pt-20 bg-indigo-50 items-stretch">
        <div className="col-span-12 lg:col-span-7 lg:pl-20 max-w-2xl p-10">
          <div className="absolute -mt-[100px] mr-3">
            <Image
              src="/images/homepage/squiggles.svg"
              width="135"
              height="135"
              className="ml-12"
              alt="Good Party"
            />
          </div>
          <h1 className="text-6xl md:text-[92px] font-semibold">
            Helping
            <br />
            independents
            <br />
            run and win
            <br />
          </h1>
          <h2 className="text-lg font-sfpro font-normal leading-6 mt-5">
            We&apos;re not a political party – we&apos;re building a movement
            and free tech to end America&apos;s two-party political dysfunction
          </h2>
          <h3 className="text-lg font-sfpro font-normal leading-6 mt-5">
            Learn how you can plug in to inspiring independent campaigns or get
            access to our free tools for people-powered candidates
          </h3>
          <EmailForm
            formId="5d84452a-01df-422b-9734-580148677d2c"
            pageName="Home Page"
            labelId="subscribe-form"
            label="Join the movement"
          />
        </div>
        <div className="flex col-span-12 lg:col-span-5 relative h-full lg:pt-10">
          <Image
            src={bgImg}
            sizes="50vw"
            className="object-contain object-right-top"
            alt=""
            // placeholder="blur"
            priority
          />
        </div>
      </div>
    </MaxWidth>
  );
}
