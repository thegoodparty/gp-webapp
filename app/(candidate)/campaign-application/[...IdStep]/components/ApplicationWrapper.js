'use client';
/**
 *
 * ApplicationWrapper
 *
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { RiPencilFill } from 'react-icons/ri';
import Sticky from 'react-sticky-el';
import { useRouter, usePathname } from 'next/navigation';
import { leftLinks } from './fields';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import MaxWidth from '@shared/layouts/MaxWidth';


const topLinks = {};
leftLinks.forEach((link) => {
    topLinks[link.step] = link;
});

function ApplicationWrapper({
    step,
    children,
    canContinue,
    id,
    withWhiteBg = true,
    submitApplicationCallback,
    reviewMode,
    approveApplicationCallback,
    rejectApplicationCallback,
}) {
    const [isSticky, setIsSticky] = useState(false);

    const pathname = usePathname();
    return (
        <MaxWidth>
            <div 
                className="application-wrapper pt-4 px-0 pb-36 md:pt-9 md:px-0 md:pb-36 md:flex"
            >
                <div
                    className='flex items-center justify-between pb-4 text-sm leading-4 font-semibold text-black md:hidden'
                >
                    <div>{topLinks[step].label}</div>
                    <div className="flex">
                        {leftLinks.map((link) => (
                            <Link
                                href={`/campaign-application/${id}/${link.step}`}
                                key={link.step}
                            >
                                <div className={`py-1 px-2 text-center text-black font-medium rounded-md
                                    ${step === link.step && 'bg-black text-white font-semibold'}`}>
                                    {link.step}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className='w-56'>
                    <Sticky
                        onFixedToggle={(isOn) => setIsSticky(isOn)}
                        boundaryElement=".application-wrapper"
                    >
                        <div className="hidden md:block md:pt-8 md:px-4 md:pb-8 md:w-56 mt-10">
                            {reviewMode && <div className="text-red-600 font-semibold mb-6 p-2">REVIEW MODE</div>}
                            {leftLinks.map((link) => (
                                <Link
                                    href={`/campaign-application/${id}/${link.step}`}
                                    key={link.step}
                                    data-cy="sidebar-link"
                                >
                                    <div className={`text-black text-sm leading-5 tracking-wide md:text-base md:leading-6 p-2 mb-2 rounded-md  ${step === link.step && 'bg-black text-white font-semibold'}`}>
                                        {link.label}
                                    </div>
                                </Link>
                            ))}
                            <br />
                            {!reviewMode && (
                                <Link href="/profile/campaigns">
                                    <BlackButtonClient
                                        className="outline !p-4 !bg-white !text-black flex items-center"
                                        fullWidth
                                        style={{ padding: '4px' }}
                                    >
                                        <RiPencilFill /> &nbsp; Finish Later
                                    </BlackButtonClient>
                                </Link>
                            )}
                        </div>
                    </Sticky>
                </div>
                <div className={` flex-1 p-0 md:pt-2 md:pr-0 md:pb-0 md:pl-8 ${isSticky && 'with-sticky'}`}>
                    <div 
                        className={` bg-stone-50 rounded-lg p-4 md:p-6 ${!withWhiteBg && 'bg-transparent shadow-none'}`}
                        style={{
                            boxShadow: "1px 1px 1px rgba(0, 0, 0, 0.04), 0 0 2px rgba(0, 0, 0, 0.06),0 0 1px rgba(0, 0, 0, 0.04)"
                        }}
                    >{children}</div>
                </div>
                <div
                    className='fixed bottom-0 left-0 w-[100vw] py-6 px-2 bg-white text-center z-10'
                    style={{boxShadow: '0 0 12px rgba(0, 0, 0, 0.2)'}}
                >
                    {step === 1 && (
                        <div className='w-[90%] max-w-[800px] inline-block'>
                            <Link
                                href={
                                    canContinue ? `/campaign-application/${id}/2` : pathname
                                }
                            >
                                {reviewMode ? (
                                    <BlackButtonClient fullWidth>Continue</BlackButtonClient>
                                ) : (
                                    <BlackButtonClient fullWidth disabled={!canContinue}>
                                    Continue
                                    </BlackButtonClient>
                                )}
                            </Link>
                        </div>
                    )}
                    {step > 1 && (
                        <div className='w-[90%] max-w-[800px] inline-block'>
                            <div className='grid grid-cols-12 gap-2'>
                                <div className='col-span-6'>
                                    <Link
                                        href={`/campaign-application/${id}/${step - 1}`}
                                    >
                                        <BlackButtonClient className="outline" fullWidth>
                                            Back
                                        </BlackButtonClient>
                                    </Link>
                                </div>
                                <div className='col-span-6'>
                                    {step === 7 ? (
                                        <>
                                        {reviewMode ? (
                                            <Link href={`/campaign-application/${id}/8`}>
                                                <BlackButtonClient fullWidth>
                                                    Approve/Reject
                                                </BlackButtonClient>
                                            </Link>
                                        ) : (
                                            <>
                                            {id === 'guest' ? (
                                                <Link
                                                    href={canContinue ? '/register' : '#'}
                                                >
                                                    <BlackButtonClient fullWidth disabled={!canContinue}>
                                                        Register &amp; Submit for Review
                                                    </BlackButtonClient>
                                                </Link>
                                            ) : (
                                                <BlackButtonClient
                                                    fullWidth
                                                    disabled={!canContinue}
                                                    onClick={() => submitApplicationCallback(id)}
                                                >
                                                    Submit for review
                                                </BlackButtonClient>
                                            )}
                                            </>
                                        )}
                                        </>
                                    ) : (
                                        <Link
                                            href={
                                                canContinue
                                                ? `/campaign-application/${id}/${step + 1}`
                                                : pathname
                                            }
                                        >
                                            <BlackButtonClient fullWidth disabled={!canContinue}>
                                                Continue
                                            </BlackButtonClient>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MaxWidth>
    );
}

export default ApplicationWrapper;
