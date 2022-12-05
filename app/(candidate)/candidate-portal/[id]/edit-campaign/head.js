import GpHead from '@shared/layouts/GpHead';

export default function Head({ params }) {
  const { id } = params;
  return (
    <GpHead
      title="Edit Candidate  | GOOD PARTY"
      description="Edit Candidate."
      slug={`/candidate-portal${id}/edit-campaign`}
    />
  );
}
