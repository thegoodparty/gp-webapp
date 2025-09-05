import Paper from '@shared/utils/Paper'
import DashboardLayout from '../../../shared/DashboardLayout'
import ContactsStatsSection from './ContactsStatsSection'
import ContactsTable from './ContactsTable'
import TitleSection from './TitleSection'
import PersonOverlay from './person/PersonOverlay'
import Filters from './Filters'
import Download from './Download'

export default function ContactsPage() {
  return (
    <DashboardLayout>
      <Paper>
        <TitleSection />
        <ContactsStatsSection />
        <div className="relative">
          <Filters />
          <Download />
          <ContactsTable />
        </div>
      </Paper>
      <PersonOverlay />
    </DashboardLayout>
  )
}
