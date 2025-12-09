'use client'
import Link from 'next/link'
import { slugify } from '../../../helpers/articleHelper'
import { fireGTMButtonClickEvent } from '@shared/buttons/fireGTMButtonClickEvent'
import { termLinkByTitle } from './TermSnippet'

interface TermTitleLinkProps {
  title: string
}

export const TermTitleLink = ({ title }: TermTitleLinkProps): React.JSX.Element => (
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
