
'use client';

import React from 'react';

export default function LogoutSection() {
    return (
        <div className="text-right">
            <a
                className="underline" 
                href="#"
                // onClick={signoutCallback}
                data-cy="profile-logout-link"
            >
                Sign Out
            </a>
        </div>
    );
  }
  