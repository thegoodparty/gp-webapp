'use client'
import Paper from '@shared/utils/Paper'
import DashboardLayout from '../../../shared/DashboardLayout'
import ContactsTable from './ContactsTable'
import PersonOverlay from './person/PersonOverlay'
import Download from './Download'
import SegmentSection from './segments/SegmentSection'
import ContactsStatsSection from './ContactsStatsSection'
import { ContactSearch } from './ContactSearch'
import { ContactProModalProvider } from '../hooks/ContactProModal'
import { useState } from 'react'
import {
  ProUpgradeModal,
  VARIANTS,
} from 'app/(candidate)/dashboard/shared/ProUpgradeModal'
import { useCampaign } from '@shared/hooks/useCampaign'
import { useContactsTable } from '../hooks/ContactsTableProvider'

export default function ContactsPage() {
  const [showProModal, setShowProModal] = useState(false)
  const [campaign] = useCampaign()
  const { isCustomSegment, totalSegmentContacts } = useContactsTable()
  return (
    <ContactProModalProvider value={setShowProModal}>
      <DashboardLayout campaign={campaign}>
        <Paper className="h-full">
          <div className="flex flex-col">
            <h1 className="text-3xl font-semibold">Contacts</h1>
            <p className="text-lg font-normal text-muted-foreground">
              Manage and filter on your constituent list
            </p>
          </div>

          <div className="w-full mt-6 flex items-center space-between">
            <div className="flex flex-col md:flex-row flex-1 items-center gap-2 mr-4">
              <SegmentSection />
              <Download />
            </div>
            <div className="align-right hidden md:flex md:w-full xl:w-[400px]">
              <ContactSearch />
            </div>
          </div>

          <div className="mt-6">
            <ContactsStatsSection
              totalVisibleContacts={totalSegmentContacts}
              onlyTotalVisibleContacts={isCustomSegment}
            />
          </div>

          <div className="flex align-right md:hidden sm:w-full">
            <ContactSearch />
          </div>
          <div className="relative mt-6 lg:mt-0">
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
