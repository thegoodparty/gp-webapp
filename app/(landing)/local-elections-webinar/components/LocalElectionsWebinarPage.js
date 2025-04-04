import { AcademySignUpModal } from '../../academy/components/AcademySignUpModal/AcademySignUpModal'
import { AcademySignUpModalProvider } from '../../academy/components/AcademySignUpModal/AcademySignUpModalProvider'
import LocalElectionsHero from './LocalElectionsHero'
import IsNowYourTime from './IsNowYourTime'
import CampaignExperts from './CampaignExperts'
import KickTheTires from './KickTheTires'
import {
  DEFAULT_SLANT_SECTION_COLORS,
  SlantSection,
} from '@shared/landing-pages/SlantSection'
import { theme } from 'tailwind.config'

export const LocalElectionsWebinarPage = () => (
  <AcademySignUpModalProvider>
    <AcademySignUpModal />
    <LocalElectionsHero />
    <IsNowYourTime />
    <SlantSection
      colors={[
        ...DEFAULT_SLANT_SECTION_COLORS.slice(0, 2),
        theme.extend.colors.secondary.main,
      ]}
    >
      <CampaignExperts />
    </SlantSection>
    <KickTheTires />
  </AcademySignUpModalProvider>
)
