import Body1 from '@shared/typography/Body1';

import { toTitleCase } from 'helpers/stringHelper';
import { GrRadial, GrRadialSelected } from 'react-icons/gr';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

export default function RaceCard({
  race,
  // modalCallback,
  selected,
  selectCallback,
  inputValue,
}) {
  const { position } = race;
  if (!position) {
    return null;
  }
  const { name, level } = position;

  let titleLevel = toTitleCase(level);
  if (titleLevel === 'City') {
    titleLevel = 'Local';
  }
  let pillColor;
  if (level === 'FEDERAL') {
    pillColor = 'bg-red-100';
  }
  if (level === 'STATE') {
    pillColor = 'bg-[#33E1B2] bg-opacity-50';
  }
  if (level === 'COUNTY') {
    pillColor = 'bg-[#3ABBEA] bg-opacity-50';
  }
  if (level === 'CITY' || level === 'LOCAL') {
    pillColor = 'bg-[#C985F2] bg-opacity-50';
  }

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
      className="flex px-4 py-4 bg-slate-50 rounded-md mb-2 items-center justify-between cursor-pointer transition-colors hover:bg-slate-200"
      onClick={() => selectCallback(race)}
    >
      <div className="flex items-center">
        {selected ? (
          <GrRadialSelected className="text-primary" />
        ) : (
          <GrRadial />
        )}
        <Body1 className="ml-2 text-left">{renderOption(name)}</Body1>
      </div>
      <div
        className={`${pillColor} px-3 py-1 text-sm rounded-full whitespace-nowrap ml-2`}
      >
        {titleLevel} office
      </div>
    </div>
  );
}
