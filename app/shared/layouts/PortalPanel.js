export default function PortalPanel({ children, color, ...props }) {
  return (
    <div className="bg-white w-full p-6 relative mb-3 lg:py-9 px-12" {...props}>
      {color && (
        <div
          className="absolute top-8 left-0 h-7 w-2"
          style={{ backgroundColor: color }}
        />
      )}
      {children}
    </div>
  );
}
