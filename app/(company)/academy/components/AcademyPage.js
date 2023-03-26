import MaxWidth from '@shared/layouts/MaxWidth';
import Curriculum from './Curriculum';
import Hero from './Hero';
import Instructors from './Instructors';
import LearnMore from './LearnMore';
import Timeline from './Timeline';
import YouGet from './YouGet';

export default function AcademyPage() {
  return (
    <>
      <Hero />
      <MaxWidth>
        <Curriculum />
        <Timeline />
        <YouGet />
        <Instructors />
        <LearnMore />
      </MaxWidth>
    </>
  );
}
