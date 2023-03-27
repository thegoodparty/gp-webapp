import Image from 'next/image';
import GetStartedButton from './GetStartedButton';

import zoomImg from '/public/images/landing-pages/curriculum.jpg';

export default function Curriculum({ openModalCallback }) {
  return (
    <div className="mt-10 grid grid-cols-12 gap-8">
      <div className=" col-span-12 lg:col-span-6 relative min-h-[300px] md:min-h-[500px]">
        <Image
          src={zoomImg}
          alt="curriculum"
          width={1084}
          height={623}
          className="shadow-xl"
        />
      </div>
      <div className=" col-span-12 lg:col-span-6">
        <h2 className="font-black text-5xl mb-5">Our curriculum</h2>
        <p className="text-2xl mb-12">
          Our battle-tested political team built our comprehensive 4 part
          curriculum to train good people on how to run, win and serve outside
          of the two party system. Graduates earn the knowledge and ability
          required to confidently decide whether or not to run and the know-how
          to run winning campaigns.
        </p>
        <GetStartedButton
          openModalCallback={openModalCallback}
          id="academy-curriculum-get-started"
        />
      </div>
    </div>
  );
}
