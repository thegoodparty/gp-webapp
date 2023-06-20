'use client';
import H4 from '@shared/typography/H4';

export default function Endorsements(props) {
  const { endorsement } = props;
  if (!endorsement) {
    return null;
  }
  const { name, content, image } = endorsement;

  return (
    <div className="px-6 py-5 bg-indigo-700 rounded-2xl flex">
      <div>img</div>
      <div>
        <H4>{name}</H4>
      </div>
    </div>
  );
}
