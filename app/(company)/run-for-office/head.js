import GpHead from '@shared/layouts/GpHead';
import Script from 'next/script';

export default function Head({ params }) {
  return (
    <>
      <GpHead
        title="Run as an Indie or 3rd Party. | Good Party"
        description="We've made it simple and free like democracy should be."
        slug="/run"
      />
      <Script src="https://www.googleoptimize.com/optimize.js?id=OPT-WLTK9ST"></Script>
    </>
  );
}
