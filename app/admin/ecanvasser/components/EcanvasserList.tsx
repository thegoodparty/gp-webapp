import EcanvasserCard from './EcanvasserCard'

interface Ecanvasser {
  id: string | number
  email?: string
  contacts?: number
  houses?: number
  interactions?: number
  lastSync?: string
  error?: string
  campaignId: string | number
}

interface EcanvasserListProps {
  ecanvassers: Ecanvasser[]
  onUpdate: () => void
}

export default function EcanvasserList({
  ecanvassers,
  onUpdate,
}: EcanvasserListProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-12 gap-4  mt-12">
      {Array.isArray(ecanvassers) &&
        ecanvassers.map((ecanvasser) => (
          <EcanvasserCard
            key={ecanvasser.id}
            ecanvasser={ecanvasser}
            onUpdate={onUpdate}
          />
        ))}
    </div>
  )
}
