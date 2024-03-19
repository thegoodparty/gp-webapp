'use client';

import { Select } from '@mui/material';
import WarningButton from '@shared/buttons/WarningButton';
import EmailInput, { isValidEmail } from '@shared/inputs/EmailInput';
import H2 from '@shared/typography/H2';
import H3 from '@shared/typography/H3';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { dateUsHelper } from 'helpers/dateHelper';
import { Fragment, useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';

async function sendInvitation(email, role) {
  try {
    const api = gpApi.campaign.volunteerInvitation.create;

    const payload = {
      email,
      role,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at sendInvitation', e);
    return {};
  }
}
async function deleteInvitation(id) {
  try {
    const api = gpApi.campaign.volunteerInvitation.delete;

    const payload = {
      id,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at sendInvitation', e);
    return {};
  }
}

async function fetchInvitations() {
  try {
    const api = gpApi.campaign.volunteerInvitation.list;

    return await gpFetch(api);
  } catch (e) {
    console.log('error at fetchInvitations', e);
    return {};
  }
}

export default function InvitationSection(props) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [invitations, setInvitations] = useState(false);

  useEffect(() => {
    loadInvitations();
  }, []);
  const loadInvitations = async () => {
    const res = await fetchInvitations();
    setInvitations(res.invitations);
  };
  const onChangeField = (val) => {
    setEmail(val);
  };

  const handleInvite = async () => {
    if (!canSubmit()) {
      return;
    }
    const res = await sendInvitation(email, role);
    if (res?.invitations) {
      setInvitations(res.invitations);
    }
  };

  const canSubmit = () => {
    return isValidEmail(email);
  };

  const handleDeleteInvitation = async (id) => {
    const res = await deleteInvitation(id);
    if (res?.invitations) {
      setInvitations(res.invitations);
    }
  };
  return (
    <section className="bg-gray-50 border border-slate-300 mb-6 py-6 px-8 rounded-xl">
      <H2 className="mb-8">Invite volunteers</H2>

      <div className="grid grid-cols-12 gap-2 mt-4">
        <div className="col-span-12 md:col-span-4 lg:col-span-5">
          <EmailInput
            value={email}
            onChangeCallback={(e) => setEmail(e.target.value)}
            shrink
          />
        </div>

        <div className="col-span-12 md:col-span-4 lg:col-span-5">
          <Select
            native
            value={role}
            fullWidth
            variant="outlined"
            onChange={(e) => setRole(e.target.value)}
            label="Role"
            InputLabelProps={{
              shrink: true,
            }}
          >
            <option value="">Select Role</option>
            <option value="volunteer">Volunteer</option>
            <option value="staff">Staff</option>
          </Select>
        </div>

        <div className="col-span-12 md:col-span-4 lg:col-span-2">
          <div onClick={handleInvite}>
            <WarningButton fullWidth disabled={!canSubmit()}>
              Invite
            </WarningButton>
          </div>
        </div>
      </div>
      {invitations && invitations.length > 0 && (
        <>
          <H3 className="mt-8">Invitations</H3>
          <div className="grid grid-cols-12 gap-2 mt-4">
            <div className="col-span-6 md:col-span-4 bg-slate-300 px-2 py-2">
              Email
            </div>
            <div className="col-span-3 md:col-span-4 bg-slate-300 px-2 py-2">
              Status
            </div>
            <div className="col-span-3 md:col-span-4 bg-slate-300 px-2 py-2">
              Date
            </div>
            {invitations.map((invitation) => (
              <Fragment key={invitation.id}>
                <div className="col-span-6 md:col-span-4 line-clamp-1 px-2 py-2">
                  {invitation.email}
                </div>
                <div className="col-span-3 md:col-span-4 line-clamp-1  px-2 py-2">
                  {invitation.role}
                </div>
                <div className="col-span-2 md:col-span-3 line-clamp-1  px-2 py-2">
                  {dateUsHelper(invitation.createdAt)}
                </div>
                <div className="col-span-1 line-clamp-1 justify-end flex  px-2 py-2">
                  <FaTrash
                    className="text-red-400 cursor-pointer hover:text-red-600 transition-colors"
                    onClick={() => {
                      handleDeleteInvitation(invitation.id);
                    }}
                  />
                </div>
                <div className="col-span-12 border-b border-slate-200"></div>
              </Fragment>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
