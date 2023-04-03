import Image from 'next/image';
import GetStartedButton from './GetStartedButton';
import budlongImg from '/public/images/landing-pages/jared-budlong.jpg';
export default function YouGet({ openModalCallback }) {
  return (
    <div className="mt-28 grid grid-cols-12 gap-8">
      <div className=" col-span-12 lg:col-span-8 lg:order-last">
        <h2 className="font-black text-5xl mb-5">What You&apos;ll Get</h2>
        <p className="text-2xl mb-12">
          Graduates of Good Party Academy gain the knowledge and skills
          necessary to run a smart campaign for public office. If you choose to
          take the next step, GPA alumni gain access to Good Party&apos;s free
          campaign tools, ongoing access to expert support and a cohort of
          change makers looking to positively impact their communities. Not to
          mention MVP status in Good Party&apos;s movement!
        </p>
        <GetStartedButton
          openModalCallback={openModalCallback}
          id="academy-you_get-get-started"
        />
      </div>
      <div className=" col-span-12 lg:col-span-4 relative">
        <Image
          src={budlongImg}
          alt="Jared Budlong"
          width={389}
          height={378}
          className="shadow-xl"
        />
      </div>
    </div>
  );
}
