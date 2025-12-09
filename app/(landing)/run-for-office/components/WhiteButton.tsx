interface WhiteButtonProps {
  label: string
  fullWidth?: boolean
}

export default function WhiteButton({ label, fullWidth }: WhiteButtonProps): React.JSX.Element {
  return (
    <button
      className={`bg-white text-black border border-black rounded-lg py-3 px-6 font-medium ${
        fullWidth ? 'w-full' : ''
      }`}
    >
      {label}
    </button>
  )
}
