import Body1 from '@shared/typography/Body1';

import { toTitleCase } from 'helpers/stringHelper';
import { GrRadial, GrRadialSelected } from 'react-icons/gr';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import Body2 from '@shared/typography/Body2';
import { dateUsHelper } from 'helpers/dateHelper';
import { dateUsHelper } from 'helpers/dateHelper';

export default function RaceCard({
  race,
  // modalCallback,
  selected,
  selectCallback,
  inputValue,
}) {
  const { position, election } = race;
  const { position, election } = race;
  if (!position) {
    return null;
  }
  const { name, normalizedPosition } = position;
  const { electionDay, primaryElectionDate } = election;

  const handleKeyDown = (e, race) => {
    if (e.key === 'Enter') {
      selectCallback(race);
    }
  };

  const renderOption = (label) => {
    const matches = match(label, inputValue, {
      insideWords: true,
    });
    const parts = parse(label, matches);

    return (
      <span>
        {(parts || []).map((part, index) => (
          <span
            key={index}
            style={{
              fontWeight: part.highlight ? 700 : 400,
            }}
          >
            {part.text}
          </span>
        ))}
      </span>
    );
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="flex px-4 py-4 bg-indigo-50 rounded-md mb-2 items-center justify-between cursor-pointer transition-colors hover:bg-slate-200"
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
          <Body2 className="mt-2">
            Election Date: {dateUsHelper(electionDay)}{' '}
            {primaryElectionDate ? (
              <span>
                | Primary Election Date: {dateUsHelper(primaryElectionDate)}
              </span>
            ) : (
              ''
            )}
          </Body2>
        </div>
      </div>
      <div
        className={`${pillColor} px-3 py-1 text-sm rounded-full whitespace-nowrap ml-2`}
      >
        {titleLevel} office
      </div>
    </div>
  );
}
