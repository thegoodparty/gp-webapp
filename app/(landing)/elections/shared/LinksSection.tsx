import Link from 'next/link'

interface BaseEntity {
  name?: string
}

interface LinksSectionProps<T extends BaseEntity> {
  entities?: T[] | null
  linkFunc: (entity: T) => string
  title: string
}

export default function LinksSection<T extends BaseEntity>({
  entities,
  linkFunc,
  title,
}: LinksSectionProps<T>): React.JSX.Element | null {
  if (!entities || entities.length === 0) {
    return null
  }
  return (
    <section className="bg-white px-4 pt-5 pb-12 md:p-12 md:rounded-3xl shadow-lg">
      <h2 className="font-medium text-xl md:text-3xl mb-5 md:mb-10">{title}</h2>
      <div className="grid grid-cols-12 gap-4">
        {entities &&
          entities.map((entity) => (
            <div
              key={entity.name}
              className=" col-span-6 md:col-span-3 text-sm text-blue-500"
            >
              <Link href={linkFunc(entity)} id={`location-${linkFunc(entity)}`}>
                {entity.name}
              </Link>
            </div>
          ))}
      </div>
    </section>
  )
}
