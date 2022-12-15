'use client';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { Fragment, useState } from 'react';
import PortalPanel from '@shared/layouts/PortalPanel';
import PortalWrapper from '../../shared/PortalWrapper';
import EditableTopIssue from './EditableTopIssue';
import TopIssue from './TopIssue';

export const fetchCandidatePositions = async (id) => {
  const api = gpApi.campaign.candidatePosition.list;
  const payload = { id };
  return await gpFetch(api, payload);
};

export default function TopIssuesPage(props) {
  const [candidatePositions, setCandidatePositions] = useState(
    props.candidatePositions,
  );
  const updatePositionsCallback = async () => {
    const res = await fetchCandidatePositions(props.id);
    setCandidatePositions(res.candidatePositions);
  };
  return (
    <PortalWrapper {...props}>
      <PortalPanel color="#14C285">
        <h3 className="text-2xl font-black mb-8" data-cy="top-issue-title">
          Issues
        </h3>
        <div className="grid grid-cols-12 gap-6 items-center">
          {candidatePositions.map((candidatePosition, index) => (
            <Fragment key={candidatePosition.id}>
              <TopIssue
                index={index}
                candidatePosition={candidatePosition}
                updatePositionsCallback={updatePositionsCallback}
                {...props}
              />
            </Fragment>
          ))}
          <EditableTopIssue {...props} />
        </div>
      </PortalPanel>
    </PortalWrapper>
  );
}
