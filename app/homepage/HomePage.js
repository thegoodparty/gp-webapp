import Hero from './Hero';
import FactsSection from './FactsSection';
import HowSection from './HowSection';
import ToolsSection from './ToolsSection';
import Cta from './Cta';
import Callout from '@shared/utils/Callout';

export default function HomePage(props) {
  return (
    <div className="bg-slate-50">
      <Callout />

      <Hero />

      <div className="bg-[linear-gradient(-172deg,_#EEF3F7_54.5%,_#161F31_55%)] h-[calc(100vw*.17)] w-full" />
      <FactsSection />
      <div className="bg-[linear-gradient(-172deg,_#161F31_54.5%,_#EEF3F7_55%)] h-[calc(100vw*.17)] w-full" />
      <HowSection />
      <div className="bg-[linear-gradient(-172deg,_#EEF3F7_54.5%,_#161F31_55%)] h-[calc(100vw*.17)] w-full" />
      <ToolsSection />
      <div className="bg-[linear-gradient(-172deg,_#161F31_54.5%,_#EEF3F7_55%)] h-[calc(100vw*.17)] w-full" />

      <Cta />
    </div>
  );
}
