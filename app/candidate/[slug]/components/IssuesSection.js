export default function IssuesSection({
  color,
  candidatePositions,
  candidate,
}) {
  const { customIssues } = candidate;
  if (!candidatePositions && !customIssues) {
    return null;
  }

  return (
    <section className="bg-white my-3 p-6 rounded-2xl">
      <h3 className="font-bold mb-3 text-xl">Issues I care about</h3>
      {candidatePositions &&
        candidatePositions.map((position) => (
          <div key={position.id}>
            <div className="inline-block rounded mb-3 relative">
              <div
                className="absolute h-full w-full opacity-30 rounded"
                style={{ backgroundColor: color }}
              />
              <div className="opacity-100 relative z-10  py-2 px-4 font-black">
                {position.position ? position.position.name : position.name}
              </div>
            </div>
            <div className="mb-9 break-words">{position.description}</div>
          </div>
        ))}

      {customIssues &&
        customIssues.map((position) => (
          <div key={position.description}>
            <div className="inline-block rounded mb-3 relative">
              <div
                className="absolute h-full w-full opacity-30 rounded"
                style={{ backgroundColor: color }}
              />
              <div className="opacity-100 relative z-10  py-2 px-4 font-black">
                General
              </div>
            </div>
            <div className="mb-9 break-words">{position.description}</div>
          </div>
        ))}
    </section>
  );
}
