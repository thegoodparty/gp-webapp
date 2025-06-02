export const GradientOverlay = ({ children, className = '' }) => (
  <div className={`relative ${className}`}>
    <div className="relative overflow-auto">
      {children}
      <div
        className="absolute bottom-0 left-0 right-0 h-5/6 w-full backdrop-blur-[1px]"
        style={{
          mask: `linear-gradient(to bottom, transparent, rgba(0, 0, 0, .40), rgba(0, 0, 0, .95), rgba(0, 0, 0, 1))`,
        }}
      />
      <div
        className={`
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-t 
          from-indigo-100
          from-12% 
          to-transparent 
          to-95%
        `}
      />
    </div>
  </div>
)
