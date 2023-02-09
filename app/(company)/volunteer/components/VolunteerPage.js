import MaxWidth from '@shared/layouts/MaxWidth';
import Hero from './Hero';
import VolunteerWithGoodParty from './VolunteerWithGoodParty';

export default function RunForOfficePage() {
  return (
    <div className="mb-40">
      <Hero />
      <div className="max-w-screen-xl mx-auto px-0 xl:p-0">
        <VolunteerWithGoodParty />
      </div>
    </div>
  );
}
