import MaxWidth from '@shared/layouts/MaxWidth'
import { Fragment } from 'react'
import { termLink } from './TermSnippet'
import { slugify } from 'helpers/articleHelper'
import Link from 'next/link'

export default function TermsByLetter(props) {
  const { items, activeLetter, glossaryItems, recentGlossaryItems } = props

  return (
    <MaxWidth>
      <div className="flex my-9 lg:mt-5">
        {items && items.length > 0 ? (
          <div className="flex flex-col mt-5">
            <div className="flex flex-col text-2xl font-black">
              More terms beginning with {activeLetter}
            </div>

            {items.map((item) => (
              <div className="flex flex-col mt-5" key={item.title}>
                <Link
                  id={`terms-${slugify(item.title, true)}`}
                  href={termLink(item)}
                >
                  {item.title}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>
    </MaxWidth>
  )
}
