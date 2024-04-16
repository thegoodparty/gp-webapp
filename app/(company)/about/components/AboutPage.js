import MaxWidth from '@shared/layouts/MaxWidth';
import BlogSection from 'app/homepage/BlogSection';
import SubscribeSection from 'app/homepage/SubscribeSection';
import ForSection from './ForSection';
import Hero from './Hero';
import WhoWhySection from './WhoWhySection';
import Callout from '@shared/utils/Callout';
import PeopleShouldSection from './PeopleShouldSection';
import NotPoliticalSection from './NotPoliticalSection';

export default function RunForOfficePage() {
  return <>
    <Callout />
    <Hero />
    <PeopleShouldSection />
    <NotPoliticalSection />
    <SubscribeSection pageName="About Page" />
  </>
}
