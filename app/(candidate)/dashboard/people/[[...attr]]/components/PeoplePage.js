import Paper from '@shared/utils/Paper'
import DashboardLayout from '../../../shared/DashboardLayout'
import PeopleStatsSection from './PeopleStatsSection'
import PeopleTable from './PeopleTable'
import TitleSection from './TitleSection'
import PersonOverlay from './person/PersonOverlay'
import Filters from './Filters'

export default function PeoplePage() {
  return (
    <DashboardLayout>
      <Paper>
        <TitleSection />
        <PeopleStatsSection />
        <div className="relative">
          <Filters />
          <PeopleTable />
        </div>
      </Paper>
      <PersonOverlay />
    </DashboardLayout>
  )
}
