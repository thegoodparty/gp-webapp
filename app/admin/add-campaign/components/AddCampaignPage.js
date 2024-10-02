'use client';
import Button from '@shared/buttons/Button';
import RenderInputField from '@shared/inputs/RenderInputField';
import PortalPanel from '@shared/layouts/PortalPanel';
import H2 from '@shared/typography/H2';
import { CampaignOfficeSelectionModal } from 'app/(candidate)/dashboard/shared/CampaignOfficeSelectionModal';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { useState } from 'react';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import { useHookstate } from '@hookstate/core';

const createCampaign = async (payload) => {
  try {
    const res = await gpFetch(gpApi.campaign.adminCreate, payload);
    if (res.campaign) {
      return res;
    }
    return false;
  } catch (e) {
    console.log('error', e);
    return false;
  }
};

const fields = [
  {
    key: 'firstName',
    label: 'First Name',
    type: 'text',
    cols: 6,
    required: true,
  },
  {
    key: 'lastName',
    label: 'Last Name',
    type: 'text',
    cols: 6,
    required: true,
  },
  { key: 'email', label: 'Email', type: 'email', cols: 6, required: true },
  { key: 'phone', label: 'Phone', type: 'phone', cols: 6, required: true },
  {
    key: 'zip',
    label: 'Zip Code',
    type: 'text',
    cols: 6,
    required: true,
  },
  {
    key: 'party',
    label: 'Party',
    type: 'select',
    cols: 6,
    required: true,
    options: [
      'Independent',
      'Forward Party',
      'Libertarian',
      'Green Party',
      'Nonpartisan',
    ],
  },
];

const initialState = fields.reduce((acc, field) => {
  acc[field.key] = '';
  return acc;
}, {});

const AddCampaignPage = (props) => {
  const [state, setState] = useState(initialState);
  const [showModal, setShowModal] = useState(false);
  const [campaign, setCampaign] = useState(null);
  const snackbarState = useHookstate(globalSnackbarState);

  const onChangeInput = (key, value) => {
    setState((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleEdit = () => {
    setShowModal(true);
  };

  const handleUpdate = async () => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Saved',
        isError: false,
      };
    });
    setShowModal(false);
    setState(initialState);
    setCampaign(null);
  };

  const canCreate = () => {
    return fields.every((field) => state[field.key]);
  };

  const handleCreate = async () => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Creating...',
        isError: false,
      };
    });
    const res = await createCampaign(state);
    if (res) {
      console.log('success');
      setCampaign(res.campaign);
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Created!',
          isError: false,
        };
      });
    } else {
      snackbarState.set(() => {
        return {
          isOpen: true,
          message: 'Error creating campaign. Is this email already in use?',
          isError: true,
        };
      });
    }
  };

  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <H2 className="mb-12">Add a new Campaign</H2>

        <div className="grid grid-cols-12 gap-3">
          {fields.map((field) => (
            <RenderInputField
              field={field}
              value={state[field.key]}
              onChangeCallback={onChangeInput}
              key={field.key}
            />
          ))}
        </div>

        <div className="my-6">
          <Button
            color="primary"
            onClick={handleCreate}
            disabled={!canCreate()}
          >
            Step 1 - Create Campaign
          </Button>
        </div>
        <hr />
        <div className="mt-6">
          <Button color="primary" onClick={handleEdit} disabled={!campaign}>
            Step 2 - Select Office
          </Button>
        </div>
        {campaign && (
          <CampaignOfficeSelectionModal
            campaign={campaign}
            show={campaign && showModal}
            onClose={() => setShowModal(false)}
            onSelect={handleUpdate}
            adminMode
          />
        )}
      </PortalPanel>
    </AdminWrapper>
  );
};

export default AddCampaignPage;
