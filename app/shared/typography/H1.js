export default function H1({ children, className = '' }) {
  return (
    <h1 className={`font-medium text-[32px] md:text-4xl  ${className}`}>
      {children}
    </h1>
  )
}
