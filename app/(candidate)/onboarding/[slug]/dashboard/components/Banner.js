import H1 from '@shared/typography/H1';

export default function Banner({ campaign }) {
  const { launchStatus } = campaign;
  return (
    <div className="pb-8">
      {launchStatus === 'launched' ? (
        <div className="p-2 text-lg text-center bg-green-600 text-white">
          Your campaign is launched
        </div>
      ) : null}
      {launchStatus === 'pending' ? (
        <div className="p-2 text-lg text-center bg-black text-white">
          Your campaign launch is pending a review.
        </div>
      ) : null}
    </div>
  );
}
