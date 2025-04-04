import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im'

export const IssuePosition = ({
  position,
  selected = false,
  handleSelectPosition = (v) => {},
  disabled = false,
}) => (
  <div
    className={`
        flex 
        items-center 
        p-4 
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        rounded-lg 
        bg-primary-background 
        border-2 
        border-neutral-main
        mb-3 
        transition-colors 
        ${!disabled ? 'hover:border-tertiary-light' : ''} 
        ${selected && !disabled ? 'bg-tertiary-background' : ''}
        ${disabled ? 'text-neutral' : ''}
      `}
    onClick={() => {
      !disabled && handleSelectPosition(position)
    }}
  >
    {selected ? (
      <ImCheckboxChecked className="mr-2" />
    ) : (
      <ImCheckboxUnchecked className="mr-2" />
    )}
    {position.name} {disabled ? '(Previously Selected)' : ''}
  </div>
)
