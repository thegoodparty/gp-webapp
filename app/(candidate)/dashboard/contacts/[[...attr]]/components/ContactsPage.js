'use client'
import Paper from '@shared/utils/Paper'
import DashboardLayout from '../../../shared/DashboardLayout'
import ContactsTable from './ContactsTable'
import TitleSection from './TitleSection'
import PersonOverlay from './person/PersonOverlay'
import Download from './Download'
import SegmentSection from './segments/SegmentSection'
import ContactsStatsSection from './ContactsStatsSection'
import { ContactProModalProvider } from '../hooks/ContactProModal'
import { useState } from 'react'
import {
  ProUpgradeModal,
  VARIANTS,
} from 'app/(candidate)/dashboard/shared/ProUpgradeModal'

export default function ContactsPage({ peopleStats }) {
  const [showProModal, setShowProModal] = useState(false)
  return (
    <ContactProModalProvider value={setShowProModal}>
      <DashboardLayout>
        <Paper className="h-full">
          <TitleSection />
          <ContactsStatsSection peopleStats={peopleStats} />
          <div className="relative">
            <SegmentSection />
            <Download />
            <ContactsTable />
          </div>
        </Paper>
        <PersonOverlay />
      </DashboardLayout>
      <ProUpgradeModal
        variant={VARIANTS.Second_NonViable}
        open={showProModal}
        onClose={() => setShowProModal(false)}
        onUpgradeLinkClick={() => setShowProModal(false)}
        defaultTrackingEnabled
      />
    </ContactProModalProvider>
  )
}
