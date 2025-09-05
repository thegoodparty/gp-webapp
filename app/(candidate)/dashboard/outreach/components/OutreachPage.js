'use client'
import React from 'react'
import DashboardLayout from '../../shared/DashboardLayout'
import { OutreachHeader } from './OutreachHeader'
import FreeTextsBanner from './FreeTextsBanner'
import OutreachCreateCards from './OutreachCreateCards'
import { OutreachTable } from 'app/(candidate)/dashboard/outreach/components/OutreachTable'
import { OutreachProvider } from 'app/(candidate)/dashboard/outreach/hooks/OutreachContext'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { useSingleEffect } from '@shared/hooks/useSingleEffect'

export const OutreachPage = ({
  pathname,
  campaign,
  outreaches = [],
  mockOutreaches = [],
  tcrCompliance,
}) => {
  useSingleEffect(() => {
    trackEvent(EVENTS.Outreach.ViewAccessed)
  }, [])
  return (
    <OutreachProvider initValue={outreaches}>
      <DashboardLayout pathname={pathname} campaign={campaign}>
        <OutreachHeader />
        <FreeTextsBanner tcrCompliance={tcrCompliance} />
        <OutreachCreateCards tcrCompliance={tcrCompliance} />
        <OutreachTable
          {...{
            mockOutreaches,
          }}
        />
      </DashboardLayout>
    </OutreachProvider>
  )
}
