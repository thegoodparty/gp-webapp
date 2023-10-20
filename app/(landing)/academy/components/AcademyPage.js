import Sessions from 'app/(landing)/academy-webinar/Sessions';
import Experts from 'app/(landing)/academy-webinar/components/Experts';
import GraduateSpotlight from 'app/(landing)/academy-webinar/components/GraduateSpotlight';
import Graduates from 'app/(landing)/academy-webinar/components/Graduates';
import Hero from 'app/(landing)/academy-webinar/components/Hero';
import Hero2 from 'app/(landing)/academy-webinar/components/Hero2';
import WhyAcademy from 'app/(landing)/academy-webinar/components/WhyAcademy';
const content = {
  heroDesc:
    'Discover how you can run for office and make a real impact in your community. Meet with our team to learn more and reserve your spot.',
  hero2Desc:
    'A 3-week course designed to guide you through every step of running for public office. Meet our team so we can get to know you and your goals!',
  formId: '46116311-525b-42a2-b88e-d2ab86f26b8a',
  ctaRedirect: true,
};

export default function AcademyPage() {
  return (
    <>
      <Hero content={content} />
      <Hero2 content={content} />
      <WhyAcademy content={content} />
      <Experts content={content} />
      <Sessions />
      <Graduates content={content} />
      <GraduateSpotlight content={content} />
    </>
  );
}
