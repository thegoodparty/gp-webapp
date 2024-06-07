'use client';

import PortalPanel from '@shared/layouts/PortalPanel';
import H2 from '@shared/typography/H2';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import SearchForm from './SearchForm';
import AdminCandidatesTable from 'app/admin/candidates/components/AdminCandidatesTable';
import { FiChevronRight } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { URLSearchParamsToObject } from 'helpers/URLSearchParamsToObject';
import { useSearchParams } from 'next/navigation';
import H4 from '@shared/typography/H4';
import gpFetch from 'gpApi/gpFetch';
import gpApi from 'gpApi';
import { CircularProgress } from '@mui/material';

const fetchCampaigns = async () => {
  try {
    const api = gpApi.campaign.list;

    return await gpFetch(api);
  } catch (e) {
    console.log('error', e);
    return { campaigns: [] };
  }
};

const CampaignStatisticsPage = (props) => {
  const { fireHose } = props;
  const [campaigns, setCampaigns] = useState(props.campaigns);
  const [showForm, setShowForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const searchParamsAreEmpty = !Object.keys(
    URLSearchParamsToObject(useSearchParams()),
  ).length;

  console.log('fireHose', fireHose);
  console.log('props.campaigns', props.campaigns);
  console.log('campaigns', campaigns);

  useEffect(() => {
    if (fireHose) {
      loadCampaigns();
    } else {
      setCampaigns(props.campaigns);
    }
  }, [fireHose, props.campaigns]);

  const loadCampaigns = async () => {
    setLoading(true);
    const res = await fetchCampaigns();
    setCampaigns(res.campaigns);
    setLoading(false);
  };

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
        {campaigns?.length > 0 ? (
          <AdminCandidatesTable campaigns={campaigns} />
        ) : (
          <H4 className="text-center">
            {loading ? (
              <div>
                Loading <br />
                <CircularProgress size={20} />
              </div>
            ) : (
              <>
                {searchParamsAreEmpty ? (
                  <span>Please perform a search...</span>
                ) : (
                  <span>
                    Your search returned 0 records.
                    <br />
                    Please refine your search and try again.
                  </span>
                )}
              </>
            )}
          </H4>
        )}
      </PortalPanel>
    </AdminWrapper>
  );
};

export default CampaignStatisticsPage;
