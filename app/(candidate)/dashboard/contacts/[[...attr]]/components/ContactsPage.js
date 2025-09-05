import Paper from '@shared/utils/Paper'
import DashboardLayout from '../../../shared/DashboardLayout'
import ContactsStatsSection from './ContactsStatsSection'
import ContactsTable from './ContactsTable'
import TitleSection from './TitleSection'
import PersonOverlay from './person/PersonOverlay'
import Download from './Download'
import SegmentSection from './segments/SegmentSection'

export default function ContactsPage() {
  return (
    <DashboardLayout>
      <Paper>
        <TitleSection />
        <ContactsStatsSection />
        <div className="relative">
          <SegmentSection />
          <Download />
          <ContactsTable />
        </div>
      </Paper>
      <PersonOverlay />
    </DashboardLayout>
  )
}
