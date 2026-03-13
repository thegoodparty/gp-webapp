import H2 from '@shared/typography/H2'

interface Position {
  name: string
  description?: string
  eligibilityRequirements?: string
}

interface Race {
  position: Position
}

interface RaceModalProps {
  race: Race
}

export default function RaceModal({ race }: RaceModalProps): React.JSX.Element {
  const { position } = race

  const data = [
    { label: 'Description', value: position.description },
    {
      label: 'Eligibility requirements',
      value: position.eligibilityRequirements,
    },
  ]

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
  )
}
