'use client';

import { useHookstate } from '@hookstate/core';
import { globalUserState } from '@shared/layouts/navigation/NavRegisterOrProfile';

import { FaRegEdit } from 'react-icons/fa';
import Link from 'next/link';

export default function PortalEditLink({ candidate }) {
  const userState = useHookstate(globalUserState);
  const user = userState.get();
  return (
    <>
      {user?.isAdmin && (
        <Link href={`/candidate-portal/${candidate.id}`}>
          <FaRegEdit
            style={{
              color: '#868686',
              marginLeft: '18px',
              marginTop: '4px',
            }}
            size={28}
          />
        </Link>
      )}
    </>
  );
}
