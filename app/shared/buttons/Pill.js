export default function Pill({
  children,
  outlined,
  className = '',
  style = {},
}) {
  return (
    <button
      className={`${
        outlined ? 'bg-white text-black' : 'bg-black  text-white'
      } py-4 px-8 no-underline border-black border-solid border rounded-full font-bold  btn-primary  active:shadow-md ${className}`}
      style={style}
    >
      {children}
    </button>
  )
}
