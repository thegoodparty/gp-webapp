import Hero from './Hero';
import FactsSection from './FactsSection';
import HowSection from './HowSection';
import ToolsSection from './ToolsSection';
import Cta from './Cta';
import Callout from '@shared/utils/Callout';
import ElectionCandidates from 'app/(company)/elections/[...params]/components/ElectionCandidates';

export default function HomePage(props) {
  return (
    <div className="bg-slate-50">
      <Callout />

      <Hero />
      <ElectionCandidates {...props} theme="light" />

      <div className="bg-[linear-gradient(-172deg,_#EEF3F7_54.5%,_#13161A_55%)] h-[calc(100vw*.17)] w-full" />
      <FactsSection />
      <div className="bg-[linear-gradient(-172deg,_#13161A_54.5%,_#EEF3F7_55%)] h-[calc(100vw*.17)] w-full" />
      <HowSection />
      <div className="bg-[linear-gradient(-172deg,_#EEF3F7_54.5%,_#13161A_55%)] h-[calc(100vw*.17)] w-full" />
      <ToolsSection />
      <div className="bg-[linear-gradient(-172deg,_#13161A_54.5%,_#EEF3F7_55%)] h-[calc(100vw*.17)] w-full" />

      <Cta />
    </div>
  );
}
