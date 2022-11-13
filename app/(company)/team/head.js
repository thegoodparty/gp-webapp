import GpHead from '/app/shared/layouts/GpHead';

export default function Head({ params }) {
  console.log('oo', params);
  return (
    <GpHead
      title="Team | GOOD PARTY"
      description="Good Party’s core team are the people working full-time, part-time, or as dedicated volunteer contributors on our mission of making people matter more than money in our democracy."
      slug="/team"
    />
  );
}
