import GpHead from '@shared/layouts/GpHead';
import Script from 'next/script';

export default function Head({ params }) {
  return (
    <>
      <GpHead
        title="About Good Party | GOOD PARTY"
        description="Good Party is not a political party. We're building tools to change the rules and a movement of people to disrupt the corrupt!"
        slug="/about"
      />
    </>
  );
}
