export default function Chip({ icon, label = '', className, ...rest }) {
  return (
    <div
      className={`p-2 rounded inline-flex items-center font-medium ${className}`}
      {...rest}
    >
      {icon ?? null}
      <div className="ml-1 text-xs">{label}</div>
    </div>
  );
}
