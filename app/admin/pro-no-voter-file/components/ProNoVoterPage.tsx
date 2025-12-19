import PortalPanel from '@shared/layouts/PortalPanel'
import H1 from '@shared/typography/H1'
import H3 from '@shared/typography/H3'
import AdminCandidatesTable from 'app/admin/candidates/components/AdminCandidatesTable'
import AdminWrapper from 'app/admin/shared/AdminWrapper'
import { Campaign } from 'helpers/types'

interface ProNoVoterPageProps {
  pathname: string
  title: string
  campaigns?: Campaign[]
}

export default function ProNoVoterPage({
  pathname,
  title,
  campaigns = [],
}: ProNoVoterPageProps): React.JSX.Element {
  return (
    <AdminWrapper pathname={pathname} title={title}>
      <PortalPanel color="#2CCDB0">
        <H1>Pro Users without L2 Data</H1>
        <H3 className="mt-3">
          These users upgraded to pro, but we are not able to match their office
          with L2 data.
        </H3>

        <AdminCandidatesTable campaigns={campaigns} />
      </PortalPanel>
    </AdminWrapper>
  )
}
