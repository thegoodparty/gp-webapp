import Script from 'next/script';
import Hero from './ElectionHero';
import Candidates from './ElectionCandidates';
import Volunteer from './ElectionVolunteer';
import Blog from './ElectionBlog';

export default function ElectionPage(props) {
  return (
    <div className="bg-slate-50">
      <Hero {...props} />
      <Candidates {...props} />
      <Volunteer {...props} />
      <div className="flex justify-center pb-20">
        <div className="w-[90vw] md:w-[80vw] max-w-[900px] h-[70vh] md:h-[90vh]">
          <iframe
            src="https://meetings.hubspot.com/jared-alper"
            width="100%"
            height="100%"
          />
        </div>
      </div>

      <Blog {...props} />

      <Script
        type="text/javascript"
        id="hs-script-loader"
        strategy="afterInteractive"
        src="//js.hs-scripts.com/21589597.js"
      />
    </div>
  );
}
