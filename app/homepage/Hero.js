import EmailForm from '@shared/inputs/EmailForm';
import Image from 'next/image';
import bgImg from '/public/images/homepage/art.png';
import MaxWidth from '@shared/layouts/MaxWidth';
import MarketingH1 from '@shared/typography/MarketingH1';

export default function Hero() {
  return (
    <MaxWidth>
      <div className="pt-20">
        <div className="text-3xl md:text-5xl font-semibold mb-6">
          2023 WINNERS
        </div>
        <MarketingH1 className="md:text-8xl font-semibold">
          Independent Candidates Making History
        </MarketingH1>
        <h2 className="text-xl md:text-2xl mt-8 mb-12 font-sfpro">
          These Good Party Certified candidates won their elections with
          people-powered campaigns and support from Good Party volunteers and AI
          Campaign Manager.
          <br />
          <br />
          This is only the beginning -{' '}
          <strong>join the movement for wins in your community in 2024!</strong>
        </h2>
        <EmailForm
          formId="5d84452a-01df-422b-9734-580148677d2c"
          pageName="Home Page"
          labelId="subscribe-form"
          label="Join now"
        />
      </div>
    </MaxWidth>
  );
}
