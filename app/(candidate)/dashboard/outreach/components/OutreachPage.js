'use client'
import React from 'react'
import DashboardLayout from '../../shared/DashboardLayout'
import EmptyOutreachHero from './EmptyOutreachHero'
import OutreachHeader from './OutreachHeader'
import OutreachCreateCards from './OutreachCreateCards'

export default function OutreachPage({ pathname, campaign, outreaches = [] }) {
  return (
    <DashboardLayout pathname={pathname} campaign={campaign}>
      {!outreaches.length ? <EmptyOutreachHero /> : <OutreachHeader />}
      <OutreachCreateCards />
    </DashboardLayout>
  )
}
