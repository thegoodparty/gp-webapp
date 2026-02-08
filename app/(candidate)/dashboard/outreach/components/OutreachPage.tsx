'use client'
import React from 'react'
import DashboardLayout from '../../shared/DashboardLayout'
import { OutreachHeader } from './OutreachHeader'
import FreeTextsBanner from './FreeTextsBanner'
import OutreachCreateCards from './OutreachCreateCards'
import { OutreachTable } from 'app/(candidate)/dashboard/outreach/components/OutreachTable'
import { OutreachProvider, Outreach } from 'app/(candidate)/dashboard/outreach/hooks/OutreachContext'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'
import { useSingleEffect } from '@shared/hooks/useSingleEffect'
import { Campaign, TcrCompliance } from 'helpers/types'

interface OutreachPageProps {
  pathname: string
  campaign: Campaign
  outreaches?: Outreach[]
  mockOutreaches?: Outreach[]
  tcrCompliance?: TcrCompliance
}

export const OutreachPage = ({
  pathname,
  campaign,
  outreaches = [],
  mockOutreaches = [],
  tcrCompliance,
}: OutreachPageProps) => {
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
