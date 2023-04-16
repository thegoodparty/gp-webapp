export default function WhySection({ candidate }) {
  const sections = [
    { key: 'why', title: "Why am I'm Running" },
    { key: 'pastExperience', title: 'Prior Experience' },
    { key: 'occupation', title: 'Current Occupation' },
    { key: 'funFact', title: 'Fun Fact' },
  ];
  return (
    <section className="bg-white my-3  rounded-2xl">
      {sections.map((section, index) => (
        <>
          {candidate[section.key] && (
            <div
              className={`p-6  ${
                index !== sections.length - 1 && 'border-b-4 border-slate-100'
              }`}
              key={section.key}
            >
              <h3 className="font-bold mt-5 mb-3 text-xl">{section.title}</h3>
              <div
                dangerouslySetInnerHTML={{ __html: candidate[section.key] }}
              />
            </div>
          )}
        </>
      ))}
    </section>
  );
}
