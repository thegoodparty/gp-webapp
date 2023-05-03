import H1 from '@shared/typography/H1';

export default function Hero() {
  return (
    <div>
      <div className="flex items-start">
        <H1>Campaign - Pre Launch</H1>
        <div className="bg-black text-white font-black text-xs py-1 px-2 ml-3 rounded-sm">
          BETA
        </div>
      </div>
      <h2 className="text-lg text-neutral-500 mt-4">
        Good Party will be with you every step of the way so you can build a
        successful campaign.
      </h2>
    </div>
  );
}
