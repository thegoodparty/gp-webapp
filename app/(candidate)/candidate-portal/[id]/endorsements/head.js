import GpHead from '@shared/layouts/GpHead';

export default function Head({ params }) {
  const { id } = params;
  return (
    <GpHead
      title="Endorsements  | GOOD PARTY"
      description="Campaign Endorsements"
      slug={`/candidate-portal${id}/endorsements`}
    />
  );
}
