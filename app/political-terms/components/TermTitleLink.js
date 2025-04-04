'use client'
import Link from 'next/link'
import { slugify } from '../../../helpers/articleHelper'
import { fireGTMButtonClickEvent } from '@shared/buttons/fireGTMButtonClickEvent'
import { termLinkByTitle } from './TermSnippet'

export const TermTitleLink = ({ title }) => (
  <Link
    id={`terms-${slugify(title, true)}`}
    onClick={() => {
      fireGTMButtonClickEvent({
        id: 'glossary-term',
      })
    }}
    href={termLinkByTitle(title)}
  >
    {title}{' '}
  </Link>
)
