'use client'
import React from 'react'
import DashboardLayout from '../../shared/DashboardLayout'
import EmptyOutreachHero from './EmptyOutreachHero'
import OutreachHeader from './OutreachHeader'
import OutreachCreateCards from './OutreachCreateCards'
import { OutreachTable } from 'app/(candidate)/dashboard/outreach/components/OutreachTable'

export default function OutreachPage({
  pathname,
  campaign,
  outreaches = [],
  mockOutreaches = [],
}) {
  console.log(`outreaches =>`, outreaches)
  return (
    <DashboardLayout pathname={pathname} campaign={campaign}>
      {outreaches.length ? <OutreachHeader /> : <EmptyOutreachHero />}
      <OutreachCreateCards />
      <OutreachTable
        {...{
          outreaches: outreaches.length ? outreaches : mockOutreaches,
          gradient: Boolean(!outreaches?.length),
          ...(!outreaches?.length
            ? { title: 'What your outreach could look like' }
            : {}),
        }}
      />
    </DashboardLayout>
  )
}
