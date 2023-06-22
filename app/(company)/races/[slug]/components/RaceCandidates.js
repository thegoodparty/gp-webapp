import Image from 'next/image';
import MaxWidth from '@shared/layouts/MaxWidth';

export default function RaceCandidates(props) {
  const { race } = props;
  return (
    <section className="bg-[#13161A] h-auto pt-20 pb-40">
      <MaxWidth>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 lg:col-span-6 pb-5">
            <div className="font-sfpro text-slate-50 font-semibold text-[32px] md:text-[54px] leading-[36px] md:leading-[64px]  mt-2">
              {race.candidatesTitle}
            </div>

            <div className="font-sfpro text-slate-50 text-[18px] leading-6 mt-2 max-w-md">
              {race.candidatesSubTitle}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6"></div>
        </div>
        <div className="grid grid-cols-12 gap-3 mt-20 justify-items-center">
          {race.candidates.map((candidate) => (
            <div key={candidate.slug} className="col-span-12 lg:col-span-3">
              <div className="items-center">
                <div className="relative w-[100px] h-[100px] bg-teal-500"></div>
              </div>
            </div>
          ))}
        </div>
      </MaxWidth>
    </section>
  );
}
