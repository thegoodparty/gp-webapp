import EcanvasserCard from './EcanvasserCard';

export default function EcanvasserList({ ecanvassers, onUpdate }) {
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
  );
}
