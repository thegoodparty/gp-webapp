'use client';

import Checkbox from '@mui/material/Checkbox';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import Link from 'next/link';
import { useState } from 'react';

export default function PledgeButton({ slug }) {
  const [checked, setChecked] = useState(false);
  return (
    <>
      <div className="mt-16 flex items-center text-xl font-bold mb-4">
        <Checkbox
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        &nbsp; &nbsp; I am taking the pledge
      </div>
      <Link href={checked ? `onboarding/${slug}/goals` : '#'}>
        <BlackButtonClient className="font-black" disabled={!checked}>
          Continue
        </BlackButtonClient>
      </Link>
    </>
  );
}
