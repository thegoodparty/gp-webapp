import Image from 'next/image';

export default function SectionHero({ campaignSteps, sectionIndex }) {
  return (
    <div className=" bg-white rounded-2xl relative">
      <Image
        src="/images/campaign/dashboard-bg2.svg"
        sizes="100vw"
        fill
        className="object-cover object-right-center"
        alt=""
        priority
      />
      <div className="p-8 relative z-10">
        <h1 className="font-black text-5xl">
          {campaignSteps[sectionIndex]?.title}
        </h1>
      </div>
    </div>
  );
}
