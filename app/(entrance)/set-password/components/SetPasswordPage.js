import MaxWidth from '@shared/layouts/MaxWidth';
import FormSection from './FormSection';
import InfoCardsSection from './InfoCardsSection';
import WinnersSection from './WinnersSection';

export default function SetPasswordPage({ email, token }) {
  return (
    <div className="bg-indigo-100 min-h-[calc(100vh-60px)]">
      <MaxWidth>
        <FormSection email={email} token={token} />
        <InfoCardsSection />
        <WinnersSection />
      </MaxWidth>
    </div>
  );
}
