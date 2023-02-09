import GpHead from '@shared/layouts/GpHead';
import Script from 'next/script';

export default function Head({ params }) {
  return (
    <>
      <GpHead
        title="Join the movement to end the two-party system"
        description="We're organizing a community of Good Partiers to realize our collective power to elect promising independents around the country and fix our broken system."
        slug="/volunteer"
      />
    </>
  );
}
