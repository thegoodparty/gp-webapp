'use client';
import H2 from '@shared/typography/H2';
import Paper from '@shared/utils/Paper';
import { PendingRequestCard } from 'app/(candidate)/dashboard/team/components/PendingRequestCard';
import gpFetch from 'gpApi/gpFetch';
import { useState } from 'react';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import gpApi from 'gpApi';

export const PENDING_REQUEST_ACTIONS = {
  GRANT: 'GRANT',
  DELETE: 'DELETE',
};

const deleteCampaignRequest = async (
  requestId,
  onSuccess = () => {},
  onError = () => {},
) => {
  try {
    const { url, ...apiProperties } = gpApi.campaign.campaignRequests.delete;
    const result = await gpFetch({
      url: url.replace(':id', requestId),
      ...apiProperties,
    });
    if (!result || result.ok === false) {
      console.error('error at deleteCampaignRequest', result);
      onError();
    } else {
      onSuccess();
    }
  } catch (e) {
    console.error('error at deleteCampaignRequest', e);
  }
};

export const PendingRequests = (props) => {
  const [requests, setRequests] = useState(props.requests || []);
  const snackbarState = useHookstate(globalSnackbarState);

  const handleDelete = async (request) => {
    await deleteCampaignRequest(
      request.id,
      () => {
        setRequests(requests.filter((r) => r.id !== request.id));
      },
      () =>
        snackbarState.set(() => ({
          isOpen: true,
          isError: true,
          message: 'Error deleting request',
        })),
    );
  };

  const handleGrant = async (request) => {
    try {
      const { url, ...apiProperties } = gpApi.campaign.campaignRequests.grant;
      const result = await gpFetch({
        url: url.replace(':id', request.id),
        ...apiProperties,
      });
      if (!result || result.ok === false) {
        console.error('error at approveCampaignRequest', result);
        snackbarState.set(() => ({
          isOpen: true,
          isError: true,
          message: 'Error approving request',
        }));
      } else {
        setRequests(requests.filter((r) => r.id !== request.id));
      }
    } catch (e) {
      console.error('error at approveCampaignRequest', e);
    }
  };

  const handleAction = async (action, request) => {
    switch (action) {
      case PENDING_REQUEST_ACTIONS.DELETE:
        await handleDelete(request);
        break;
      case PENDING_REQUEST_ACTIONS.GRANT:
        await handleGrant(request);
        break;
      default:
        break;
    }
  };

  return (
    <Paper>
      <div className="flex justify-between items-center">
        <H2>Pending Requests</H2>
      </div>
      <div className="grid grid-cols-12 gap-4 mt-12">
        {requests.map((request) => (
          <PendingRequestCard
            key={request.id}
            onAction={handleAction}
            request={request}
          />
        ))}
      </div>
    </Paper>
  );
};
