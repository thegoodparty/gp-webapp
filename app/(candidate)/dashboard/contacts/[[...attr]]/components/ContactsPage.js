import Paper from '@shared/utils/Paper'
import DashboardLayout from '../../../shared/DashboardLayout'
import ContactsTable from './ContactsTable'
import TitleSection from './TitleSection'
import PersonOverlay from './person/PersonOverlay'
import Download from './Download'
import SegmentSection from './segments/SegmentSection'
import ContactsPageGuard from './ContactsPageGuard'
import ContactsStatsSection from './ContactsStatsSection'
import { ContactSearch } from './ContactSearch'

export default function ContactsPage({ peopleStats }) {
  return (
    <ContactsPageGuard>
      <DashboardLayout>
        <Paper className="h-full">
          <div className="flex flex-row justify-between items-end">
            <TitleSection />
            <ContactSearch />
          </div>
          <ContactsStatsSection peopleStats={peopleStats} />
          <div className="relative">
            <SegmentSection />
            <Download />
            <ContactsTable />
          </div>
        </Paper>
        <PersonOverlay />
      </DashboardLayout>
    </ContactsPageGuard>
  )
}
