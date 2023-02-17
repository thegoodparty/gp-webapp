import MaxWidth from '@shared/layouts/MaxWidth';
import BlogSection from 'app/homepage/BlogSection';
import SubscribeSection from 'app/homepage/SubscribeSection';
import ForSection from './ForSection';
import Hero from './Hero';
import WhoWhySection from './WhoWhySection';

export default function RunForOfficePage() {
  return (
    <div>
      <Hero />
      <MaxWidth>
        <ForSection />
        <WhoWhySection />
        <BlogSection />
      </MaxWidth>
      <SubscribeSection pageName="About Page" />
    </div>
  );
}
