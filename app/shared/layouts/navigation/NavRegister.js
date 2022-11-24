'use client';

import React, { Suspense, useState } from 'react';
import RegisterModal from '../RegisterModal';

export default function NavRegister() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <strong
        className="mx-3 px-1 cursor-pointer hover:underline"
        data-cy="header-register"
        id="desktop-nav-register"
        onClick={() => setShowRegister(true)}
      >
        Join Us
      </strong>

      {showRegister && (
        <Suspense>
          <RegisterModal
            closeModalCallback={() => {
              setShowRegister(false);
            }}
          />
        </Suspense>
      )}
    </>
  );
}
