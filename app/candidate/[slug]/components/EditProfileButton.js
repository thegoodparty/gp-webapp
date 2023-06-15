'use client';

import SecondaryButton from '@shared/buttons/SecondaryButton';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import { candidateRoute } from 'helpers/candidateHelper';
import { getUserCookie } from 'helpers/cookieHelper';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export async function canEdit(slug) {
  try {
    const api = gpApi.candidate.canEdit;
    const payload = {
      slug,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at loadCandidatePosition', e);
    return false;
  }
}

export default function EditProfileButton(props) {
  const [show, setShow] = useState(false);
  const { candidate } = props;
  useEffect(() => {
    const user = getUserCookie();
    if (user) {
      checkAccess();
    }
  }, []);

  const checkAccess = async () => {
    if (candidate) {
      const access = await canEdit(candidate?.slug);
      if (access) {
        setShow(true);
      }
    }
  };
  if (!show) {
    return null;
  }
  return (
    <Link
      href={`${candidateRoute(candidate)}/edit`}
      className="block mt-3 w-full"
    >
      <SecondaryButton fullWidth>Edit</SecondaryButton>
    </Link>
  );
}
