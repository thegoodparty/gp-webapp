'use client';
import H2 from '@shared/typography/H2';
import Paper from '@shared/utils/Paper';
import { PendingRequestCard } from 'app/(candidate)/dashboard/team/components/PendingRequestCard';
import gpFetch from 'gpApi/gpFetch';
import { useState } from 'react';
import gpApi from 'gpApi';
import Body2 from '@shared/typography/Body2';
import { useSnackbar } from 'helpers/useSnackbar';

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
  const { errorSnackbar } = useSnackbar();

  const handleDelete = async (request) => {
    await deleteCampaignRequest(
      request.id,
      () => {
        setRequests(requests.filter((r) => r.id !== request.id));
      },
      () => errorSnackbar('Error deleting request'),
    );
  };

  const handleGrant = async (request) => {
    await grantCampaignRequest(
      request.id,
      () => {
        setRequests(requests.filter((r) => r.id !== request.id));
      },
      () => errorSnackbar('Error approving request'),
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
        <div className="flex justify-between items-center mb-6">
          <header className="align-left">
            <H2 className="mb-2">Requested</H2>
            <Body2 className="text-gray-700">
              Someone has requested to join your campaign.
            </Body2>
          </header>
        </div>
        <div className="grid grid-cols-12 gap-4">
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
