import MaxWidth from '@shared/layouts/MaxWidth';
import ExpandWithImages from './ExpandWithImages';
import Hero from './Hero';
import InvolvedSection from './InvolvedSection';
import VolunteerWithGoodParty from './VolunteerWithGoodParty';
import Callout from '@shared/utils/Callout';

export default function RunForOfficePage() {
  return (
    <div className="mb-40">
      <Callout />
      <Hero />
      <div className="max-w-screen-xl mx-auto px-0 xl:p-0">
        <VolunteerWithGoodParty />
        <ExpandWithImages />
        <InvolvedSection />
      </div>
    </div>
  );
}
