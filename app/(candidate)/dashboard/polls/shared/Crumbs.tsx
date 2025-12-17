'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from 'goodparty-styleguide'
import { Fragment } from 'react'

interface BreadcrumbLinkItem {
  label: string
  href?: string
}

interface CrumbsProps {
  breadcrumbsLinks: BreadcrumbLinkItem[]
}

export default function Crumbs({
  breadcrumbsLinks,
}: CrumbsProps): React.JSX.Element {
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
