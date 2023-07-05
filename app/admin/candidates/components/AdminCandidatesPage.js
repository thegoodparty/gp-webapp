'use client';

import { GoTrashcan } from 'react-icons/go';

import PortalPanel from '@shared/layouts/PortalPanel';
import AdminWrapper from 'app/admin/shared/AdminWrapper';
import { candidateRoute, partyResolver } from 'helpers/candidateHelper';
import { useMemo, useState } from 'react';
import Table from './Table';
import Link from 'next/link';
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import AlertDialog from '@shared/utils/AlertDialog';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import { IoIosPersonAdd } from 'react-icons/io';
import mapCampaignToCandidate from 'app/candidate/[slug]/edit/mapCampaignToCandidate';
import { dateUsHelper } from 'helpers/dateHelper';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Actions from './Actions';

export const deleteCandidate = async (id) => {
  const api = gpApi.admin.deleteCandidate;
  const payload = { id };
  return await gpFetch(api, payload);
};

function mapStatus(status) {
  if (!status) {
    return 'No (Onboarding)';
  }
  if (status === 'launched') {
    return 'Live';
  }
  if (status === 'pending') {
    return 'Pending Review';
  }
  return 'No';
}

export default function AdminCandidatesPage(props) {
  const { campaigns } = props;
  const snackbarState = useHookstate(globalSnackbarState);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(false);

  const inputData = [];
  if (campaigns) {
    campaigns.map((campaignObj) => {
      const { data } = campaignObj;
      const campaign = mapCampaignToCandidate(data);
      console.log(`camObj: ${campaign.slug}`, campaignObj);
      const { user } = campaignObj;
      const { currentStep } = data || {};
      const fields = {
        id: campaignObj.id,
        slug: campaign.slug,
        firstName: campaign.firstName,
        lastName: campaign.lastName,
        launched: mapStatus(campaign.launchStatus),
        party: partyResolver(campaign.party),
        chamber: campaign.chamber,
        office: campaign.office,
        district: campaign.district || 'n/a',
        state: campaign.state ? campaign.state.toUpperCase() : '?',
        createdAt: dateUsHelper(campaignObj.createdAt),
        updatedAt: dateUsHelper(campaignObj.updatedAt),
        email: user?.email || 'n/a',
        phone: user?.phone || 'n/a',
        currentStep,
      };
      inputData.push(fields);
    });
  }
  const data = useMemo(() => inputData);

  const handleDeleteCandidate = (id) => {
    setCandidateToDelete(id);
    setShowDeleteAlert(true);
  };

  const handleProceedDelete = async () => {
    snackbarState.set(() => {
      return {
        isOpen: true,
        message: 'Deleting candidate...',
        isError: false,
      };
    });
    await deleteCandidate(candidateToDelete);
    window.location.reload();
  };

  const handleCloseAlert = () => {
    setCandidateToDelete(false);
    setShowDeleteAlert(false);
  };

  const columns = useMemo(() => [
    {
      Header: 'Actions',
      collapse: true,
      accessor: 'actions',
      Cell: ({ row }) => {
        return <Actions {...row.original} />;
      },
    },
    {
      Header: 'Profile',
      accessor: 'slug',
      Cell: ({ row }) => {
        const route = candidateRoute(row.original);
        return (
          <a
            href={route}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="underline"
          >
            {row.original.slug}
          </a>
        );
      },
    },
    {
      Header: 'First Name',
      accessor: 'firstName',
    },
    {
      Header: 'Last Name',
      accessor: 'lastName',
    },
    {
      Header: 'Launch Status',
      accessor: 'launched',
    },
    {
      Header: 'Review Link',
      accessor: 'reviewLink',
      Cell: ({ row }) => {
        const status = row.original.launched;
        if (status === 'Pending Review') {
          const route = `${candidateRoute(row.original)}/review`;
          return (
            <a
              href={route}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="underline"
            >
              Pending Review
            </a>
          );
        }
        return <span>n/a</span>;
      },
    },
    {
      Header: 'Onboarding Step',
      accessor: 'currentStep',
    },
    {
      Header: 'Date Created',
      accessor: 'createdAt',
    },
    {
      Header: 'Last Update',
      accessor: 'updatedAt',
    },
    {
      Header: 'Path to Victory',
      accessor: 'victoryPath',
      Cell: ({ row }) => {
        return (
          <a
            href={`/admin/victory-path/${row.original.slug}`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="underline"
          >
            Path to victory
          </a>
        );
      },
    },
    {
      Header: 'Party',
      accessor: 'party',
    },
    {
      Header: 'Office',
      accessor: 'office',
    },
    {
      Header: 'Jurisdiction',
      accessor: 'district',
    },
    {
      Header: 'State',
      accessor: 'state',
      collapse: true,
    },
    {
      Header: 'Email',
      accessor: 'email',
      Cell: ({ row }) => {
        return (
          <a href={`mailto:${row.original.email}`} className="underline">
            {row.original.email}
          </a>
        );
      },
    },
    {
      Header: 'Phone',
      accessor: 'phone',
      collapse: true,
    },

    // {
    //   Header: 'Delete',
    //   collapse: true,
    //   accessor: 'name',
    //   Cell: ({ row }) => {
    //     return (
    //       <div className="flex justify-center">
    //         <GoTrashcan
    //           onClick={() => {
    //             handleDeleteCandidate(row.original.id);
    //           }}
    //           style={{ color: 'red', cursor: 'pointer' }}
    //         />
    //       </div>
    //     );
    //   },
    // },
  ]);

  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <div className="text-right">
          <Link href="/admin/add-candidate">
            <BlackButtonClient>
              <div className="font-black flex items-center">
                <IoIosPersonAdd size={24} />{' '}
                <div className="ml-1"> Add a candidate</div>
              </div>
            </BlackButtonClient>
          </Link>
        </div>
        <Table columns={columns} data={data} />
      </PortalPanel>
      <AlertDialog
        title="Delete Candidate?"
        description="This can't be undone, and you will have to deal with it in your afterlife"
        open={showDeleteAlert}
        handleClose={handleCloseAlert}
        handleProceed={handleProceedDelete}
      />
    </AdminWrapper>
  );
}
