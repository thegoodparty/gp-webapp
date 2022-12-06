import GpHead from '@shared/layouts/GpHead';

export default function Head({ params }) {
  const { id } = params;
  return (
    <GpHead
      title="Edit Top Issues | GOOD PARTY"
      description="Edit top issues"
      slug={`/candidate-portal${id}/top-issues`}
    />
  );
}
