'use client';
import H2 from '@shared/typography/H2';
import Paper from '@shared/utils/Paper';
import { PendingRequestCard } from 'app/(candidate)/dashboard/team/components/PendingRequestCard';
import gpFetch from 'gpApi/gpFetch';
import { useState } from 'react';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import gpApi from 'gpApi';
import Body1 from '@shared/typography/Body1';

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
    const result = await gpFetch(gpApi.campaign.campaignRequests.delete, {
      id: requestId,
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

const grantCampaignRequest = async (
  requestId,
  onSuccess = () => {},
  onError = () => {},
) => {
  try {
    const result = await gpFetch(gpApi.campaign.campaignRequests.grant, {
      id: requestId,
    });
    if (!result || result.ok === false) {
      console.error('error at approveCampaignRequest', result);
      onError();
    } else {
      onSuccess();
    }
  } catch (e) {
    console.error('error at approveCampaignRequest', e);
  }
};

export const PendingRequests = ({
  requests: initRequests,
  onAction = () => {},
}) => {
  const [requests, setRequests] = useState(initRequests || []);
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
    await grantCampaignRequest(
      request.id,
      () => {
        setRequests(requests.filter((r) => r.id !== request.id));
      },
      () => {
        snackbarState.set(() => ({
          isOpen: true,
          isError: true,
          message: 'Error approving request',
        }));
      },
    );
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
    await onAction();
  };

  return (
    Boolean(requests?.length) && (
      <Paper className="mb-4">
        <div className="flex justify-between items-center">
          <header className="align-left">
            <H2>Requested</H2>
            <Body1 className="text-gray-500">
              Someone has requested to join your campaign.
            </Body1>
          </header>
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
    )
  );
};
