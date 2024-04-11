import Hero from './Hero';
import FactsSection from './FactsSection';
import HowSection from './HowSection';
import ToolsSection from './ToolsSection';
import Cta from './Cta';
import Callout from '@shared/utils/Callout';

export default function HomePage(props) {
  return (
    <div className="bg-indigo-200">
      <Callout />

      <Hero />

      <div className="bg-[linear-gradient(-172deg,_#F9FAFB_54.5%,_#0D1528_55%)] h-[calc(100vw*.17)] w-full" />
      <FactsSection />
      <div className="bg-[linear-gradient(-172deg,_#0D1528_54.5%,_#F9FAFB_55%)] h-[calc(100vw*.17)] w-full" />
      <HowSection />
      <div className="bg-[linear-gradient(-172deg,_#F9FAFB_54.5%,_#0D1528_55%)] h-[calc(100vw*.17)] w-full" />
      <ToolsSection />
      <div className="bg-[linear-gradient(-172deg,_#0D1528_54.5%,_#F9FAFB_55%)] h-[calc(100vw*.17)] w-full" />

      <Cta />
    </div>
  );
}
