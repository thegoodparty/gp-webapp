import { ReactNode, CSSProperties } from 'react'

interface PillProps {
  children?: ReactNode
  outlined?: boolean
  className?: string
  style?: CSSProperties
}

const Pill = ({
  children,
  outlined,
  className = '',
  style = {},
}: PillProps) => (
  <button
    className={`${
      outlined ? 'bg-white text-black' : 'bg-black  text-white'
    } py-4 px-8 no-underline border-black border-solid border rounded-full font-bold  btn-primary  active:shadow-md ${className}`}
    style={style}
  >
    {children}
  </button>
)

export default Pill

