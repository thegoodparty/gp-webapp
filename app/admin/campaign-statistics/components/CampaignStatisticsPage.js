'use client';

import PortalPanel from '@shared/layouts/PortalPanel';
import H2 from '@shared/typography/H2';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import SearchForm from './SearchForm';
import AdminCandidatesTable from 'app/admin/candidates/components/AdminCandidatesTable';
import { FiChevronRight } from 'react-icons/fi';
import { useState } from 'react';

const CampaignStatisticsPage = (props) => {
  const { campaigns } = props;
  const [showForm, setShowForm] = useState(true);

  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <H2
          className="cursor-pointer inline-flex items-center [&>svg]:inline [&>svg]:ml-1"
          onClick={() => setShowForm(!showForm)}
        >
          Search Campaigns{' '}
          <FiChevronRight
            className={`transition-all transform${
              showForm ? ' rotate-90' : ''
            }`}
          />
        </H2>
        <SearchForm show={showForm} />
        {Boolean(campaigns?.length) && <AdminCandidatesTable {...props} />}
      </PortalPanel>
    </AdminWrapper>
  );
};

export default CampaignStatisticsPage;
