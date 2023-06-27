export default function CandidatePill({ text, color, className }) {
  return (
    <div className={`relative py-1 px-3 rounded-full ${className}`}>
      <div
        className="absolute w-full h-full rounded-full top-0 left-0 opacity-10"
        style={{ backgroundColor: color }}
      />
      <div className="relative" style={{ color }}>
        {text}
      </div>
    </div>
  );
}
