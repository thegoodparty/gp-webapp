import DashboardLayout from '../../shared/DashboardLayout'
import PeopleStatsSection from './PeopleStatsSection'
import PeopleTable from './PeopleTable'
import TitleSection from './TitleSection'

export default function PeoplePage() {
  return (
    <DashboardLayout>
      <TitleSection />
      <PeopleStatsSection />
      <PeopleTable />
    </DashboardLayout>
  )
}
