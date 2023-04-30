import Script from 'next/script';
import Help from './Help';
import Hero from './Hero';
import Steps from './Steps';

export default function Dashboard(props) {
  return (
    <div className="bg-slate-100 min-h-[calc(100vh-80px)] relative pb-16 pt-8">
      <div className="max-w-screen-lg mx-auto px-4 xl:p-0">
        <Hero {...props} />
        <Steps {...props} />
        <Help />
        <Script
          type="text/javascript"
          id="hs-script-loader"
          strategy="afterInteractive"
          src="//js.hs-scripts.com/21589597.js"
        />
      </div>
    </div>
  );
}
