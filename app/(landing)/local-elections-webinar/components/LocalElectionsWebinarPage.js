import {
  AcademySignUpModal
} from '../../academy/components/AcademySignUpModal/AcademySignUpModal';
import {
  AcademySignUpModalProvider
} from '../../academy/components/AcademySignUpModal/AcademySignUpModalProvider';
import LocalElectionsHero from './LocalElectionsHero';

export const LocalElectionsWebinarPage = () => <AcademySignUpModalProvider>
  <AcademySignUpModal />
  <LocalElectionsHero />
</AcademySignUpModalProvider>
