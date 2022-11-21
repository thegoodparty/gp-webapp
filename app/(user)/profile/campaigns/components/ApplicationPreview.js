/**
 *
 * ApplicationPreview
 *
 */

import React from 'react';
import Link from 'next/link';
import { FaTrash } from 'react-icons/fa';
import { dateUsHelper } from 'helpers/dateHelper';
import {
    candidateName,
    candidatePhoto,
    runningFor,
} from 'helpers/applicationHelper';

function ApplicationPreview({ app, deleteApplicationCallback }) {
    const photo = candidatePhoto(app);
    return (
        <Link href={`/campaign-application/${app.id}/1`} passHref legacyBehavior>
            <a className="no-underline" data-cy="application-link">
                <div 
                    className="break-word p-5 bg-white border-t-2 border-solid border-black rounded-md cursor-pointer text-center mb-3" 
                    style={{boxShadow: "0 20px 20px -10px #a3a5ae"}}
                >
                    {app.status === 'incomplete' ? (
                        <div className="text-right trash">
                        <FaTrash
                            onClick={(e) => deleteApplicationCallback(app.id, e)}
                            color="red"
                        />
                        </div>
                    ) : (
                        <div>&nbsp;</div>
                    )}
                    <div className="block w-[130px] h-[130px] p-1 rounded-full mt-0 mb-3 mx-auto border-2 border-black">
                        <div
                            className="block w-[120px] h-[120px] rounded-full bg-center	 bg-cover bg-no-repeat"
                            style={{
                                backgroundImage: `url(${
                                photo || '/images/profile/application.png'
                                })`,
                            }}
                        />
                    </div>
                    {/* Body:  text-black text-base leading-6 tracking-wide md:text-xl md:leading-7*/}
                    <div 
                        className="text-black text-base leading-6 tracking-wide md:text-xl md:leading-7" 
                        data-cy="application-name"
                    >
                        <strong>{candidateName(app)}</strong>
                    </div>
                    {/* Body13: text-black text-sm leading-5 tracking-wide md:text-base md:leading-6*/}
                    <div 
                        className="text-black text-sm leading-5 tracking-wide md:text-base md:leading-6" 
                        data-cy="application-runfor"
                    >
                        {runningFor(app)}
                    </div>
                    <br />
                    <div 
                        className="text-black text-base leading-6 tracking-wide md:text-xl md:leading-7 bold500" data-cy="application-status"
                    >
                        <i>Status: {app.status}</i>
                    </div>
                    <br />
                    {/* Body11:  text-neutral-800 text-xs leading-4 tracking-wider md:text-sm md:leading-5 */}
                    <div 
                        className="text-neutral-800 text-xs leading-4 tracking-wider md:text-sm md:leading-5" 
                        data-cy="application-date"
                    >
                        Created At: {dateUsHelper(app.createdAt)}
                        <br />
                        Last Update: {dateUsHelper(app.updatedAt)}
                    </div>
                </div>
            </a>
        </Link>
    );
}

export default ApplicationPreview;
