import Sessions from 'app/(landing)/academy-webinar/Sessions'
import Experts from 'app/(landing)/academy-webinar/components/Experts'
import GraduateSpotlight from 'app/(landing)/academy-webinar/components/GraduateSpotlight'
import Graduates from 'app/(landing)/academy-webinar/components/Graduates'
import { AcademySignUpModalProvider } from './AcademySignUpModal/AcademySignUpModalProvider'
import { AcademySignUpModal } from './AcademySignUpModal/AcademySignUpModal'
import Hero from 'app/(landing)/academy-webinar/components/Hero'
import Hero2 from 'app/(landing)/academy-webinar/components/Hero2'
import WhyAcademy from 'app/(landing)/academy-webinar/components/WhyAcademy'

const content = {
  heroDesc:
    'Discover over three free video sessions how you can run for office and make a real impact in your community.',
  hero2Desc:
    'A 3-week course designed to guide you through every step of running for public office. Leave with the knowledge and skills to make a clear-headed decision about a run',
  formId: '46116311-525b-42a2-b88e-d2ab86f26b8a',
  ctaRedirect: true,
}

const AcademyPage = (): React.JSX.Element => (
  <AcademySignUpModalProvider>
    <AcademySignUpModal />
    <Hero content={content} />
    <Hero2 content={content} />
    <WhyAcademy content={content} />
    <Experts content={content} />
    <Sessions />
    <Graduates content={content} />
    <GraduateSpotlight content={content} />
  </AcademySignUpModalProvider>
)

export default AcademyPage
