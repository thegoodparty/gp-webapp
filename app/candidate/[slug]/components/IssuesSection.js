export default function IssuesSection({ color, candidatePositions }) {
  if (!candidatePositions) {
    return null;
  }

  return (
    <section className="bg-white my-3 p-6 rounded-2xl">
      <h3 className="font-bold mb-3 text-xl">Issues I care about</h3>
      {candidatePositions.map((position) => (
        <div key={position.id}>
          <div className="inline-block rounded mb-3 relative">
            <div
              className="absolute h-full w-full opacity-30 rounded"
              style={{ backgroundColor: color }}
            />
            <div className="opacity-100 relative z-10  py-2 px-4 font-black">
              {position.position.name}
            </div>
          </div>
          <div className="mb-9">{position.description}</div>
        </div>
      ))}
    </section>
  );
}
