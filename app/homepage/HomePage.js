import MaxWidth from '@shared/layouts/MaxWidth';
import BlogSection from './BlogSection';
import FaqsSection from './FaqsSection';
import ForCandidates from './ForCandidates';
import Hero from './Hero';
import SubscribeSection from './SubscribeSection';
import TeamSection from './TeamSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <MaxWidth>
        <ForCandidates />
        <FaqsSection />
        <TeamSection />
        <BlogSection />
      </MaxWidth>
      <SubscribeSection />
    </>
  );
}
