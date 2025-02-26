'use client';
import { useState } from 'react';
import { useSnackbar } from 'helpers/useSnackbar';
import PortalPanel from '@shared/layouts/PortalPanel';
import H2 from '@shared/typography/H2';
import RenderInputField from '@shared/inputs/RenderInputField';
import TextField from '@shared/inputs/TextField';
import Button from '@shared/buttons/Button';
import { CampaignOfficeSelectionModal } from 'app/(candidate)/dashboard/shared/CampaignOfficeSelectionModal';
import { getUserCookie } from 'helpers/cookieHelper';
import { apiRoutes } from 'gpApi/routes';
import { clientFetch } from 'gpApi/clientFetch';

const createCampaign = async (payload) => {
  try {
    const user = getUserCookie(true);
    if (!user || !user.email) {
      console.error('User not found or missing email');
    } else {
      payload.adminUserEmail = user.email;
    }

    const resp = await clientFetch(apiRoutes.admin.campaign.create, payload);
    return resp.data;
  } catch (e) {
    console.log('error', e);
    return false;
  }
};
const sendEmail = async (userId) => {
  try {
    const payload = {
      userId,
    };
    const resp = await clientFetch(
      apiRoutes.authentication.setSetPasswordEmail,
      payload,
    );
    return resp.data;
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
  { key: 'email', label: 'Email', type: 'email', cols: 12, required: true },
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
      'Other',
    ],
  },
];
export const initialValues = fields.reduce((acc, field) => {
  acc[field.key] = '';
  return acc;
}, {});

export const CreateCampaignForm = ({}) => {
  const [values, setValues] = useState(initialValues);
  const [showOfficeSelectionModal, setShowOfficeSelectionModal] =
    useState(false);
  const [newCampaign, setNewCampaign] = useState(null);
  const { successSnackbar, errorSnackbar } = useSnackbar();

  const onChangeField = (key, value) => {
    setValues({
      ...values,
      [key]: value,
    });
  };

  const openOfficeSelectionModal = () => {
    setShowOfficeSelectionModal(true);
  };

  const handleChooseOfficeComplete = async () => {
    await sendEmail(newCampaign.user);
    successSnackbar('Saved');
    setShowOfficeSelectionModal(false);
    setValues(initialValues);
    setNewCampaign(null);
  };

  const disableCreate =
    newCampaign ||
    (values.party === 'Other' && values.otherParty === '') ||
    !fields.every((field) => values[field.key]);

  const handleCreateCampaign = async () => {
    successSnackbar('Creating...');
    const campaign = await createCampaign(values);
    if (campaign) {
      setNewCampaign(campaign);
      successSnackbar('Created!');
    } else {
      errorSnackbar('Error creating campaign. Is this email already in use?');
    }
  };

  return (
    <PortalPanel color="#2CCDB0">
      <H2 className="mb-12">Add a new Campaign</H2>

      <div className="grid grid-cols-12 gap-3">
        {fields.map((field) => (
          <RenderInputField
            field={field}
            value={values[field.key]}
            onChangeCallback={onChangeField}
            key={field.key}
          />
        ))}
        {values.party === 'Other' && (
          <div className=" col-span-12 md:col-span-6 mt-5">
            <TextField
              label="Other Party"
              onChange={(e) => onChangeField('otherParty', e.target.value)}
              value={values.otherParty}
              fullWidth
            />
          </div>
        )}
      </div>

      <div className="my-6">
        <Button
          color="primary"
          onClick={handleCreateCampaign}
          disabled={disableCreate}
        >
          Step 1 - Create Campaign
        </Button>
      </div>
      <hr />
      <div className="mt-6">
        <Button
          color="primary"
          onClick={openOfficeSelectionModal}
          disabled={!newCampaign}
        >
          Step 2 - Select Office
        </Button>
      </div>
      {newCampaign && (
        <CampaignOfficeSelectionModal
          campaign={newCampaign}
          show={newCampaign && showOfficeSelectionModal}
          onClose={() => setShowOfficeSelectionModal(false)}
          onSelect={handleChooseOfficeComplete}
          adminMode
        />
      )}
    </PortalPanel>
  );
};
