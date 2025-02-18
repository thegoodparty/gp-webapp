import Body1 from '@shared/typography/Body1';
import { GrRadial, GrRadialSelected } from 'react-icons/gr';
import Body2 from '@shared/typography/Body2';

export default function RaceCard({
  race,
  // modalCallback,
  selected,
  selectCallback,
}) {
  const { position } = race;
  if (!position) {
    return null;
  }
  const { name, normalizedPosition } = position;

  const handleKeyDown = (e, race) => {
    if (e.key === 'Enter') {
      selectCallback(race);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="px-4 py-4 bg-indigo-50 rounded-md mb-2 items-center justify-between cursor-pointer transition-colors hover:bg-slate-200"
      onClick={() => selectCallback(race)}
      onKeyDown={(e) => handleKeyDown(e, race)}
    >
      <div className="flex items-center">
        {selected ? (
          <GrRadialSelected className="text-primary min-w-[16px]" />
        ) : (
          <GrRadial className="min-w-[16px]" />
        )}
        <div className="ml-3 text-left">
          <Body1>{name}</Body1>
          <Body2>{normalizedPosition?.name || ''}</Body2>
        </div>
      </div>
    </div>
  );
}
