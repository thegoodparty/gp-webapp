import GpHead from './shared/layouts/GpHead';

export default function Head({ params }) {
  return (
    <GpHead
      title="GOOD PARTY | Free tools to change the rules and disrupt the corrupt."
      description="Not a political party, we’re building tools to change the rules, empowering creatives to mobilize community & disrupt the corrupt two-party system. Join us!"
      slug={params.slug}
    />
  );
}
