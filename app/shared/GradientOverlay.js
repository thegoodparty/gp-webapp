export const GradientOverlay = ({ children, className = '' }) => (
  <div className={`relative ${className}`}>
    <div className="relative overflow-auto">
      {children}
      <div
        className="absolute bottom-0 left-0 right-0 h-full w-full backdrop-blur-[2px]"
        style={{
          mask: `linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.4) 62%, rgba(0, 0, 0, 0) 100%)`,
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
