import TextPanel from './TextPanel';

export default function WhySection(props) {
  const { candidate } = props;
  const sections = [
    { key: 'why', section: 'campaignPlan', title: "Why am I'm Running" },
    { key: 'pastExperience', section: 'details', title: 'Prior Experience' },
    { key: 'occupation', section: 'details', title: 'Current Occupation' },
    { key: 'funFact', section: 'details', title: 'Fun Fact' },
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
              <TextPanel
                text={candidate[section.key]}
                {...props}
                section={section.section}
                sectionKey={section.key}
              />
            </div>
          )}
        </>
      ))}
    </section>
  );
}
