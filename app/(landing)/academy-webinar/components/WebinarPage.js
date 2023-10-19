import Curriculum from './Curriculum';
import Dates from './Dates';
import Graduates from './Graduates';
import Sessions from '../Sessions';
import Experts from './Experts';
import GraduateSpotlight from './GraduateSpotlight';
import Hero from './Hero';
import Hero2 from './Hero2';
import WhyAcademy from './WhyAcademy';

const content = {
  heroDesc:
    'Join our free webinar to discover how you can run for office and make a real impact in your community.',
  hero2Desc:
    'A 90-minute webinar designed to guide you in the basics of running for public office and the free tools Good Party provides to help you continue on your journey. Meet our team so we can get to know you and your goals!',
};

export default function WebinarPage() {
  return (
    <>
      <Hero content={content} />
      <Hero2 content={content} />
      <WhyAcademy />
      <Experts />
      {/* <Sessions /> */}
      <Curriculum />
      <Dates />
      <Graduates />
      <GraduateSpotlight />
    </>
  );
}
