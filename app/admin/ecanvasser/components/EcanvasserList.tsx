import EcanvasserCard from './EcanvasserCard'

interface Ecanvasser {
  id: string | number
  [key: string]: string | number | boolean | object | null
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
