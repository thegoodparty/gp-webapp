import MaxWidth from '@shared/layouts/MaxWidth';
import BlogSection from 'app/homepage/BlogSection';
import SubscribeSection from 'app/homepage/SubscribeSection';
import ForSection from './ForSection';
import Hero from './Hero';
import WhoWhySection from './WhoWhySection';
import Callout from '@shared/utils/Callout';
import PeopleShouldSection from './PeopleShouldSection';
import NotPoliticalSection from './NotPoliticalSection';
import HopeSection from './HopeSection';

export default function RunForOfficePage() {
  return <>
    <Callout />
    <Hero />
    <PeopleShouldSection />
    <NotPoliticalSection />
    <HopeSection />
    <SubscribeSection pageName="About Page" />
  </>
}
