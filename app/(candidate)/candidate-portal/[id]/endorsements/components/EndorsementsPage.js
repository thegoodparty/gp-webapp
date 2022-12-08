'use client';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import AlertDialog from '@shared/utils/AlertDialog';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { revalidateCandidate } from 'helpers/cacheHelper';
import { useState } from 'react';
import PortalPanel from '../../shared/PortalPanel';
import PortalWrapper from '../../shared/PortalWrapper';
import Endorsement from './Endorsement';
import NewEndorsementForm from './NewEndorsementForm';

import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';

const deleteEndorsementCallback = async (id, candidateId) => {
  const api = gpApi.campaign.endorsement.delete;
  const payload = { id, candidateId };
  return await gpFetch(api, payload);
};

export const fetchEndorsements = async (id) => {
  const api = gpApi.campaign.endorsement.list;
  const payload = { candidateId: id };
  return await gpFetch(api, payload);
};

export default function EndorsementsPage(props) {
  const { candidate, role } = props;
  const [endorsements, setEndorsements] = useState(props.endorsements);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteEndorsement, setDeleteEndorsement] = useState(false);
  const snackbarState = useHookstate(globalSnackbarState);

  const deleteCallback = (endorsement) => setDeleteEndorsement(endorsement);
  const cancelDeleteCallback = () => setDeleteEndorsement(false);

  const handleDelete = async () => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Deleting Endorsement...',
        isError: false,
      };
    });
    await deleteEndorsementCallback(deleteEndorsement.id, candidate.id);
    setDeleteEndorsement(false);
    await updateEndorsements();
    await revalidateCandidate(candidate);
  };

  const updateEndorsements = async () => {
    const res = await fetchEndorsements(candidate.id);
    setEndorsements(res.endorsements);
    await revalidateCandidate(candidate);
  };

  return (
    <PortalWrapper {...props}>
      <PortalPanel color="#FF00DA">
        <div className="flex items-center justify-between  mb-8">
          <h3 className="text-2xl font-black" data-cy="endorsements-title">
            Endorsements
          </h3>
          <BlackButtonClient
            onClick={() => setShowAdd(true)}
            dataCy="add-endorsement"
          >
            <strong>Add Endorsement</strong>
          </BlackButtonClient>
        </div>
        {showAdd && (
          <NewEndorsementForm
            closeAdd={() => setShowAdd(false)}
            updateEndorsements={updateEndorsements}
            {...props}
          />
        )}
        <br />
        {endorsements.map((endorsement, index) => (
          <Endorsement
            endorsement={endorsement}
            last={index === endorsements.length - 1}
            deleteCallback={deleteCallback}
            key={endorsement.id}
            updateEndorsements={updateEndorsements}
            candidate={candidate}
          />
        ))}
      </PortalPanel>
      <AlertDialog
        open={deleteEndorsement}
        handleClose={cancelDeleteCallback}
        title="Delete Endorsement"
        ariaLabel="Delete Endorsement"
        description="Are you sure you want to delete this endorsement? This cannot be undone."
        handleProceed={handleDelete}
      />
    </PortalWrapper>
  );
}
