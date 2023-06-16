import MaxWidth from '@shared/layouts/MaxWidth';
import Hero from './Hero';
import FactsSection from './FactsSection';
import HowSection from './HowSection';
import ToolsSection from './ToolsSection';
// import SubscribeSection from './SubscribeSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="bg-[linear-gradient(-172deg,_#FFFFFF_54.5%,_#13161A_55%)] h-[calc(100vw*.17)] w-full" />
      <FactsSection />
      <div className="bg-[linear-gradient(-172deg,_#13161A_54.5%,_#FFFFFF_55%)] h-[calc(100vw*.17)] w-full" />
      <HowSection />
      <div className="bg-[linear-gradient(-172deg,_#FFFFFF_54.5%,_#13161A_55%)] h-[calc(100vw*.17)] w-full" />
      <ToolsSection />
      <div className="bg-[linear-gradient(-172deg,_#13161A_54.5%,_#FFFFFF_55%)] h-[calc(100vw*.17)] w-full" />

      {/* <MaxWidth>
      </MaxWidth>
      <SubscribeSection /> */}
    </>
  );
}
