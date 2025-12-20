import PortalPanel from '@shared/layouts/PortalPanel'
import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import AdminWrapper from 'app/admin/shared/AdminWrapper'
import DeleteCandidate from './DeleteCandidate'

interface PublicCandidatesProps {
  pathname: string
  title: string
}

export default function PublicCandidates(
  props: PublicCandidatesProps,
): React.JSX.Element {
  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#70EDF8">
        <H1>Public Candidates</H1>
        <Body1 className="mt-2 mb-8">
          Public candidates are not campaigns. These are the &quot;black&quot;
          profiles like:
          <br />
          <a
            href="https://goodparty.org/candidate/heather-graham/pueblo-city-mayor"
            target="_blank"
          >
            https://goodparty.org/candidate/heather-graham/pueblo-city-mayor
          </a>
        </Body1>
        <DeleteCandidate />
      </PortalPanel>
    </AdminWrapper>
  )
}
