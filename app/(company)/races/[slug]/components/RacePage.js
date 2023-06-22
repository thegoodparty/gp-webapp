'use client';
import Script from 'next/script';
import Hero from './RaceHero';
import Candidates from './RaceCandidates';
import Volunteer from './RaceVolunteer';
import Blog from './RaceBlog';

export default function CityPage(props) {
  const { race } = props;

  const childProps = {
    race,
  };

  return (
    <div className="bg-slate-50 pb-5">
      <Hero {...childProps} />
      <Candidates {...childProps} />
      <Volunteer {...childProps} />
      <div className="flex justify-center">
        <div className="w-[80vw] max-w-[900px] h-[90vh]">
          <iframe
            src="https://meetings.hubspot.com/jared-alper"
            width="100%"
            height="100%"
          />
        </div>
      </div>

      <Blog {...childProps} />

      <Script
        type="text/javascript"
        id="hs-script-loader"
        strategy="afterInteractive"
        src="//js.hs-scripts.com/21589597.js"
      />
    </div>
  );
}
