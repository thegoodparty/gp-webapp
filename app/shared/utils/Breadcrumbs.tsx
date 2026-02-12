import { MdChevronRight } from 'react-icons/md'
import { TbSlash } from 'react-icons/tb'
import { JsonLd } from 'react-schemaorg'
import clsx from 'clsx'

export interface BreadcrumbLink {
  href: string
  label: string
}

interface BreadcrumbsProps {
  links: BreadcrumbLink[]
  delimiter?: 'slash' | 'chevron'
  wrapText?: boolean
  className?: string
}

const Breadcrumbs = ({
  links,
  delimiter = 'slash',
  wrapText = false,
  className,
}: BreadcrumbsProps) => {
  const schema = links.map((link, index) => ({
    '@type': 'ListItem' as const,
    position: index + 1,
    item: {
      '@id': link.href,
      name: link.label,
    },
  }))

  const DelimiterComponent = delimiter === 'slash' ? TbSlash : MdChevronRight

  return (
    <div
      className={clsx(
        'flex items-center py-6',
        { 'whitespace-nowrap max-w-[100vw] overflow-x-auto': !wrapText },
        className,
      )}
    >
      <JsonLd
        item={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: schema,
        }}
      />
      <nav aria-label="Breadcrumb">
        <ol
          className={clsx('flex items-center gap-x-1 gap-y-2', {
            'flex-wrap': wrapText,
          })}
        >
          {links.map((link, index) => (
            <li key={link.label}>
              {index < links.length - 1 && (
                <div className="flex items-center">
                  <a
                    href={link.href}
                    className="whitespace-nowrap text-base text-primary-light hover:text-primary hover:underline"
                  >
                    <div className="text-base">{link.label}</div>
                  </a>

                  <DelimiterComponent className="ml-2" />
                </div>
              )}
            </li>
          ))}
          <li>
            <div
              className={clsx('text-base text-primary-dark', {
                'whitespace-nowrap': !wrapText,
              })}
            >
              {links[links.length - 1]?.label}
            </div>
          </li>
        </ol>
      </nav>
    </div>
  )
}

export default Breadcrumbs
