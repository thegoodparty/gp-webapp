'use client'

import { useIssue } from '../[id]/issue/[issueId]/hooks/IssueProvider'
import { usePoll } from '../[id]/hooks/PollProvider'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from 'goodparty-styleguide'
import { Fragment } from 'react'

export default function Crumbs() {
  const [issue] = useIssue()
  const [poll] = usePoll()
  const { title } = issue

  const breadcrumbsLinks = [
    { href: `/dashboard/polls`, label: 'Polls' },
    {
      label: `${poll.name}`,
      href: `/dashboard/polls/${poll.id}`,
    },
    {
      label: `${title}`,
    },
  ]

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbsLinks.map((link, index) => (
          <Fragment key={`${link.label}-${index}`}>
            <BreadcrumbItem>
              {link.href ? (
                <BreadcrumbLink href={link.href}>{link.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{link.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbsLinks.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
