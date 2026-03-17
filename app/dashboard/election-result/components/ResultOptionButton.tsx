'use client'
import { LuArrowRight, LuLoaderCircle } from 'react-icons/lu'

interface ResultOption {
  key: string
  label: string
  icon: React.ReactNode
}

interface ResultOptionButtonProps {
  option: ResultOption
  selected: boolean
  submitting: boolean
  onSelect: (key: string) => void
}

export default function ResultOptionButton({
  option,
  selected,
  submitting,
  onSelect,
}: ResultOptionButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      className={`flex items-center gap-4 cursor-pointer p-6 rounded-xl border border-base hover:bg-gray-50 text-left w-full transition-colors focus:border-gray-300 focus:outline-none ${
        selected ? '!bg-gray-900 text-white' : 'bg-white text-black'
      }`}
      disabled={submitting}
      onClick={() => onSelect(option.key)}
      aria-pressed={selected}
      aria-label={option.label}
    >
      <div className="flex items-center gap-5 pointer-events-none">
        {option.icon}
        <span className="font-bold">{option.label}</span>
      </div>
      {submitting && selected ? (
        <LuLoaderCircle className="ml-auto animate-spin" size={20} />
      ) : (
        <LuArrowRight className="ml-auto pointer-events-none" size={20} />
      )}
    </button>
  )
}
