import Curriculum from './Curriculum'
import Dates from './Dates'
import Graduates from './Graduates'
import Experts from './Experts'
import GraduateSpotlight from './GraduateSpotlight'
import Hero from './Hero'
import Hero2 from './Hero2'
import WhyAcademy from './WhyAcademy'
import { AcademySignUpModalProvider } from '../../academy/components/AcademySignUpModal/AcademySignUpModalProvider'
import { AcademySignUpModal } from '../../academy/components/AcademySignUpModal/AcademySignUpModal'

const content = {
  heroDesc:
    'Join our free webinar to discover how you can run for office and make a real impact in your community.',
  hero2Desc:
    'A 90-minute webinar designed to guide you in the basics of running for public office and the free tools GoodParty.org provides to help you continue on your journey. Meet our team so we can get to know you and your goals!',
  formId: '28d49682-0766-4fca-98ba-22394f79ec45',
  ctaRedirect: false,
}

export default function WebinarPage() {
  return (
    <AcademySignUpModalProvider>
      <AcademySignUpModal />
      <Hero content={content} />
      <Hero2 content={content} />
      <WhyAcademy content={content} />
      <Experts content={content} />
      <Curriculum />
      <Dates content={content} />
      <Graduates content={content} />
      <GraduateSpotlight content={content} />
    </AcademySignUpModalProvider>
  )
}
