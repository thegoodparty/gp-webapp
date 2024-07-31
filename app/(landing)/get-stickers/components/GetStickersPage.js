import MaxWidth from '@shared/layouts/MaxWidth';
import Hero from './Hero';
import { Brightness1 } from '@mui/icons-material';
import BrightenSection from './BrightenSection';
import FormSection from './FormSection';
import MostAmericans from './MostAmericans';

export default function GetStickersPage() {
  return (
    <div>
      <Hero />
      <BrightenSection />
      <FormSection />
      <MostAmericans />
    </div>
  );
}
