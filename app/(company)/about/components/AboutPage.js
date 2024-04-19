import AboutHero from './AboutHero';
import Callout from '@shared/utils/Callout';
import PeopleShouldSection from './PeopleShouldSection';
import NotPoliticalSection from './NotPoliticalSection';
import HopeSection from './HopeSection';
import BuildWithUsSection from './BuildWithUsSection';

export default function RunForOfficePage() {
  return <>
    <Callout />
    <AboutHero />
    <PeopleShouldSection />
    <NotPoliticalSection />
    <HopeSection />
    <BuildWithUsSection />
  </>
}
