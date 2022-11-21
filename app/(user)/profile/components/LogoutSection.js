
'use client';

import { deleteCookies } from 'helpers/cookieHelper';
import React from 'react';

export default function LogoutSection() {
    const signoutCallback = () => {
        deleteCookies();
        window.location.replace('/');
    }
    return (
        <div className="text-right">
            <a
                className="underline" 
                href="#"
                onClick={signoutCallback}
                data-cy="profile-logout-link"
            >
                Sign Out
            </a>
        </div>
    );
  }
  