'use client';

import AlertDialog from '@shared/utils/AlertDialog';
import { MoreMenu } from '@shared/utils/MoreMenu';
import { clientFetch } from 'gpApi/clientFetch';
import { apiRoutes } from 'gpApi/routes';
import { useState } from 'react';
import { useEcanvasserSurvey } from '@shared/hooks/useEcanvasserSurvey';

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

export default function EditSurvey() {
  const [survey, refreshSurvey] = useEcanvasserSurvey();
  const [isOpen, setIsOpen] = useState(false);

  const { status } = survey || {};
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
    menuItems.push({
      label: 'Unpublish door knocking script',
      onClick: handlePublish,
    });
  } else {
    menuItems.push({
      label: 'Publish door knocking script',
      onClick: handlePublish,
    });
  }

  menuItems.push({
    label: 'Delete door knocking script',
    onClick: alertBeforeDelete,
  });
  return (
    <>
      <MoreMenu menuItems={menuItems} />
      <AlertDialog
        open={isOpen}
        handleClose={() => setIsOpen(false)}
        title="Delete Door Knocking Script"
        description="Are you sure you want to delete this Door Knocking Script?"
        handleProceed={handleDelete}
      />
    </>
  );
}
