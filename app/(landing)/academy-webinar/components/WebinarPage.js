import Sessions from '../Sessions';
import Experts from './Experts';
import Hero from './Hero';
import Hero2 from './Hero2';
import WhyAcademy from './WhyAcademy';

const content = {
  heroDesc:
    'Discover how you can run for office and make a real impact in your community. Meet with our team to learn more and reserve your spot.',
};

export default function WebinarPage() {
  return (
    <>
      <Hero content={content} />
      <Hero2 />
      <WhyAcademy />
      <Experts />
      <Sessions />
    </>
  );
}
