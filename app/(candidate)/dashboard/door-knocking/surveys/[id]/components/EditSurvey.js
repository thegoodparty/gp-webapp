'use client';

import AlertDialog from '@shared/utils/AlertDialog';
import { MoreMenu } from '@shared/utils/MoreMenu';
import { clientFetch } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';
import { useState } from 'react';
const updateSurvey = async (payload) => {
  const resp = await clientFetch(apiRoutes.ecanvasser.surveys.update, payload);
  return resp.data;
};

const deleteSurvey = async (id) => {
  const resp = await clientFetch(apiRoutes.ecanvasser.surveys.delete, {
    id,
  });
  return resp.data;
};

export default function EditSurvey({ survey, refreshSurvey }) {
  const [isOpen, setIsOpen] = useState(false);

  const { status } = survey;
  const menuItems = [];
  const handlePublish = async () => {
    const payload = {
      id: survey.id,
      status: survey.status === 'Live' ? 'Not Live' : 'Live',
    };
    await updateSurvey(payload);
    refreshSurvey();
  };

  const alertBeforeDelete = () => {
    setIsOpen(true);
  };

  const handleDelete = async () => {
    await deleteSurvey(survey.id);
    window.location.href = '/dashboard/door-knocking/surveys';
  };

  if (status === 'Live') {
    menuItems.push({ label: 'Unpublish survey', onClick: handlePublish });
  } else {
    menuItems.push({ label: 'Publish survey', onClick: handlePublish });
  }

  menuItems.push({ label: 'Delete survey', onClick: alertBeforeDelete });
  return (
    <>
      <MoreMenu menuItems={menuItems} />
      <AlertDialog
        open={isOpen}
        handleClose={() => setIsOpen(false)}
        title="Delete Survey"
        description="Are you sure you want to delete this Survey?"
        handleProceed={handleDelete}
      />
    </>
  );
}
