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

interface OutreachPageProps {
  pathname: string
  campaign: { [key: string]: string | number | boolean | object | null | undefined }
  outreaches?: import('../hooks/OutreachContext').Outreach[]
  mockOutreaches?: import('../hooks/OutreachContext').Outreach[]
  tcrCompliance: { [key: string]: string | number | boolean | object | null | undefined }
}

export const OutreachPage = ({
  pathname,
  campaign,
  outreaches = [] as import('../hooks/OutreachContext').Outreach[],
  mockOutreaches = [] as import('../hooks/OutreachContext').Outreach[],
  tcrCompliance,
}: OutreachPageProps): React.JSX.Element => {
  useSingleEffect(() => {
    trackEvent(EVENTS.Outreach.ViewAccessed)
  }, [])
  return (
    <OutreachProvider initValue={outreaches}>
      <DashboardLayout pathname={pathname} campaign={campaign ?? undefined}>
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


