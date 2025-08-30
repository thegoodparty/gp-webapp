import Paper from '@shared/utils/Paper'
import DashboardLayout from '../../../shared/DashboardLayout'
import PeopleStatsSection from './PeopleStatsSection'
import PeopleTable from './PeopleTable'
import TitleSection from './TitleSection'
import SearchBar from './SearchBar'
import PersonOverlay from './person/PersonOverlay'

export default function PeoplePage() {
  return (
    <DashboardLayout>
      <Paper>
        <TitleSection />
        <PeopleStatsSection />
        <SearchBar />
        <PeopleTable />
      </Paper>
      <PersonOverlay />
    </DashboardLayout>
  )
}
