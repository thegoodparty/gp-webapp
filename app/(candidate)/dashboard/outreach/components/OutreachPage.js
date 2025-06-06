'use client'
import React from 'react'
import DashboardLayout from '../../shared/DashboardLayout'
import EmptyOutreachHero from './EmptyOutreachHero'
import OutreachHeader from './OutreachHeader'
import OutreachCreateCards from './OutreachCreateCards'
import { OutreachTable } from 'app/(candidate)/dashboard/outreach/components/OutreachTable'
import { OutreachProvider } from 'app/(candidate)/dashboard/outreach/hooks/OutreachContext'

export const OutreachPage = ({
  pathname,
  campaign,
  outreaches = [],
  mockOutreaches = [],
}) => (
  <OutreachProvider initValue={outreaches}>
    <DashboardLayout pathname={pathname} campaign={campaign}>
      {outreaches.length ? <OutreachHeader /> : <EmptyOutreachHero />}
      <OutreachCreateCards />
      <OutreachTable
        {...{
          mockOutreaches,
        }}
      />
    </DashboardLayout>
  </OutreachProvider>
)
