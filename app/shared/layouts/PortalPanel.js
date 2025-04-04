export default function PortalPanel({ children, color, smWhite, ...props }) {
  return (
    <div
      className={`bg-white w-full relative mb-3 ${
        !smWhite && 'p-6 px-12'
      } lg:py-9 lg:px-12 `}
      {...props}
    >
      {color && (
        <div
          className={`absolute top-8 left-0 h-7 w-2 ${
            smWhite && 'hidden lg:block'
          }`}
          style={{
            backgroundColor: color,
          }}
        />
      )}
      {children}
    </div>
  )
}
