import PortalPanel from '@shared/layouts/PortalPanel';
import H2 from '@shared/typography/H2';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import SearchForm from './SearchForm';
import AdminCandidatesTable from 'app/admin/candidates/components/AdminCandidatesTable';
import CampaignStatistics from './CampaignStatistics';

export default function CampaignStatisticsPage(props) {
  const { isEmptyParams } = props;

  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <H2>Search Campaigns</H2>
        {isEmptyParams ? (
          <SearchForm {...props} />
        ) : (
          <CampaignStatistics {...props} />
        )}
      </PortalPanel>
    </AdminWrapper>
  );
}
