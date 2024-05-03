import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';

export const IssuePosition = ({
  position,
  selected = false,
  handleSelectPosition = (v) => {},
}) => (
  <div
    className={`flex items-center p-4 cursor-pointer rounded-lg bg-slate-100 border-2 border-slate-300 mb-3 transition-colors hover:border-purple-200 ${
      selected ? 'bg-tertiary-background' : ''
    }`}
    onClick={() => {
      handleSelectPosition(position);
    }}
  >
    {selected ? (
      <ImCheckboxChecked className="mr-2" />
    ) : (
      <ImCheckboxUnchecked className="mr-2" />
    )}
    {position.name}
  </div>
);
