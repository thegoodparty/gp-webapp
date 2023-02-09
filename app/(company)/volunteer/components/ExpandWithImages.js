import Image from 'next/image';
import volunteerImg from '/public/images/landing-pages/volunteer.jpg';
import volunteerImgSm from '/public/images/landing-pages/volunteer-sm.jpg';
import MaxWidth from '@shared/layouts/MaxWidth';

export default function ExpandWithImages() {
  return (
    <section className="">
      <Image
        src={volunteerImg}
        alt="volunteer with Good Party"
        placeholder="blur"
        priority
        className="hidden lg:block"
      />
      <Image
        src={volunteerImgSm}
        alt="volunteer with Good Party"
        placeholder="blur"
        priority
        className="lg:hidden"
      />
      <MaxWidth>
        <h2 className="font-black text-4xl mt-12">
          Volunteering with Good Party
        </h2>
        <div className="text-2xl lg:w-2/3 mt-5 leading-relaxed">
          When you volunteer with us, you join a community that's working to
          support good people running good campaigns to fight for good ideas. Be
          a part of the movement to elect a new kind of candidate and put people
          over money.
        </div>
      </MaxWidth>
    </section>
  );
}
