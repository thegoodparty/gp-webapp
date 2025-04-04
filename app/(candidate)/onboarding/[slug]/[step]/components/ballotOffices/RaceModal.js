import H2 from '@shared/typography/H2';

export default function RaceModal({ race }) {
  const { position } = race;

  const data = [
    { label: 'Description', value: position.description },
    {
      label: 'Eligibility requirements',
      value: position.eligibilityRequirements,
    },
  ];

  return (
    <div className="">
      <H2 className="mt-2">{position.name}</H2>
      {data.map((item) => (
        <div key={item.label} className="mt-6 leading-relaxed">
          <div className="font-bold mb-2">{item.label}</div>
          <div>{item.value}</div>
        </div>
      ))}
    </div>
  );
}
