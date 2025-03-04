import Button from '@shared/buttons/Button';
import Body1 from '@shared/typography/Body1';
import Body2 from '@shared/typography/Body2';
import H3 from '@shared/typography/H3';
import { clientFetch } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';
import { dateWithTime } from 'helpers/dateHelper';
import { numberFormatter } from 'helpers/numberHelper';
import { useState } from 'react';

const syncEcanvasser = async (campaignId) => {
  try {
    const payload = {
      campaignId,
    };
    const resp = await clientFetch(apiRoutes.ecanvasser.sync, payload);
    return resp.data;
  } catch (e) {
    console.log('error syncEcanvasser', e);
    return false;
  }
};

const deleteEcanvasser = async (campaignId) => {
  const payload = {
    campaignId,
  };
  return await clientFetch(apiRoutes.ecanvasser.delete, payload);
};

export default function EcanvasserCard({ ecanvasser, onUpdate }) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    email,
    appointments,
    contacts,
    customFields,
    documents,
    efforts,
    followUps,
    houses,
    interactions,
    surveys,
    questions,
    teams,
    users,
    lastSync,
    error,
  } = ecanvasser;

  const attr = [
    { label: 'Appointments', value: appointments },
    { label: 'Contacts', value: contacts },
    { label: 'Custom Fields', value: customFields },
    { label: 'Documents', value: documents },
    { label: 'Efforts', value: efforts },
    { label: 'Follow Ups', value: followUps },
    { label: 'Houses', value: houses },
    { label: 'Interactions', value: interactions },
    { label: 'Surveys', value: surveys },
    { label: 'Questions', value: questions },
    { label: 'Teams', value: teams },
    { label: 'Users', value: users },
  ];

  const handleSync = async () => {
    setIsLoading(true);
    await syncEcanvasser(ecanvasser.campaignId);
    setIsLoading(false);
    onUpdate();
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await deleteEcanvasser(ecanvasser.campaignId);
    setIsLoading(false);
    onUpdate();
  };

  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-4">
      <div className="p-4 shadow-md rounded-xl">
        <H3 className="mb-4">{email}</H3>
        {attr.map((attr) => (
          <div className="grid grid-cols-12 gap-2" key={attr.label}>
            <Body2 className="col-span-8 font-semibold">{attr.label}</Body2>
            <Body2 className="col-span-4">
              {attr.value || attr.value === 0
                ? numberFormatter(attr.value)
                : 'n/a'}
            </Body2>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-gray-200">
          <Body1 className="text-sm text-gray-500">
            Last Sync: {lastSync ? dateWithTime(lastSync) : 'n/a'}
          </Body1>
          {error && (
            <Body1 className="text-sm text-red-500 mt-2">
              Sync error: {error}
            </Body1>
          )}
        </div>
        <div className="mt-4">
          <Button color="primary" className="w-full" onClick={handleSync}>
            Re-sync
          </Button>
        </div>
        <div className="mt-4">
          <Button
            color="error"
            className="w-full"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Delete Ecanvasser Integration
          </Button>
        </div>
      </div>
    </div>
  );
}
