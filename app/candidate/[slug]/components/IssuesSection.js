export default function IssuesSection({ candidate, color }) {
  const { topIssues } = candidate;
  if (!topIssues) {
    return null;
  }
  const { positions } = topIssues;
  return (
    <section className="bg-white my-3 p-6 rounded-2xl">
      <h3 className="font-bold mb-3 text-xl">Issues I care about</h3>
      {positions.map((position) => (
        <div key={position.id}>
          <div className="inline-block bg-opacity-10 rounded mb-3 relative">
            <div
              className="absolute h-full w-full opacity-30 rounded"
              style={{ backgroundColor: color }}
            ></div>
            <div className="opacity-100 relative z-10  py-2 px-4 font-black">
              {position.name}
            </div>
          </div>
          <div className="mb-9">{topIssues[`position-${position.id}`]}</div>
        </div>
      ))}
    </section>
  );
}
