'use client';
/**
 *
 * ApplicationStep8
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import Link from 'next/link';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';

function ApplicationStep8() {
    
    return (
        <div className="flex items-center justify-center text-center h-full min-h-[calc(100vh - 80px)]">
            <div>
                {/* H1: text-neutral-800 text-[27px] leading-9 m-0 md:text-4xl md:leading-10 */}
                <h1 className="text-black text-[27px] leading-9 m-0 mb-4 md:text-4xl md:leading-10">
                    Thanks for submitting your campaign!
                </h1>
                <div 
                    className="text-zinc-900 mb-10 text-base leading-6 tracking-wide md:text-xl md:leading-7"
                >
                    We will review your submission and get back to you soon.
                </div>
                <Link href="/" className="block mb-2">
                    {/* <LightPurpleButton fullWidth> */}
                    <BlackButtonClient>
                        <span className="font-semibold">Back to Homepage</span>
                    </BlackButtonClient>
                    {/* </LightPurpleButton> */}
                </Link>
            </div>
        </div>
    );
}

ApplicationStep8.propTypes = {};

export default ApplicationStep8;
