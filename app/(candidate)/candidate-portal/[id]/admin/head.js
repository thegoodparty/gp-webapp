import GpHead from '@shared/layouts/GpHead';

export default function Head({ params }) {
  const { id } = params;
  return (
    <GpHead
      title="Candidate Admin | GOOD PARTY"
      description="Candidate admin."
      slug={`/candidate-portal${id}/admin`}
    />
  );
}
