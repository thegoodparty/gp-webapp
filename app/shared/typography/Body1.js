export default function Body1({ children, className = '', style = {} }) {
  return (
    <div
      className={`font-normal font-sfpro text-base ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
