'use client';
/**
 *
 * ApplicationSection
 *
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import gpFetch from 'gpApi/gpFetch';
import gpApi from 'gpApi';
import AlertDialog from '@shared/utils/AlertDialog';
import ApplicationPreview from './ApplicationPreview';
import PortalPanel from '@shared/candidate-portal/PortalPanel';
import BlackOutlinedButtonClient from '@shared/buttons/BlackOutlinedButtonClient';

async function createApplication(router) {
    try {
        // yield put(snackbarActions.showSnakbarAction('Creating a new application'));
        const api = gpApi.candidateApplication.create;
        const { id } = await gpFetch(api, null, 3600);
        router.push(`/campaign-application/${id}/1`)
        return id;
        // yield put(push(`/campaign-application/${id}/1`));
    } catch (error) {
        // yield put(
        // snackbarActions.showSnakbarAction(
        //     'Error creating your application',
        //     'error',
        // ),
        // );
    }
}

async function deleteApplication(id) {
    try {
        // yield put(snackbarActions.showSnakbarAction('Deleting application'));
        const api = gpApi.candidateApplication.delete;
        const payload = {
            id,
        };
        await gpFetch(api, payload, 3600);

        // yield put(actions.loadApplicationsAction());
    } catch (error) {
        // yield put(
        // snackbarActions.showSnakbarAction(
        //     'Error creating your application',
        //     'error',
        // ),
        // );
    }
}

async function loadApplications() {
    try {
        // yield put(snackbarActions.showSnakbarAction('Loading your application'));
        const api = gpApi.candidateApplication.list;
        const res = await gpFetch(api, null, 3600);
        return res;
        // yield put(actions.loadApplicationsActionSuccess(applications));
    } catch (error) {
        console.log(error)
    }
}

function ApplicationSection() {
    const router = useRouter();
    const [applications, setApplications] = useState([]);
    const loadApplicationsFunc = async () => {
        const res = await loadApplications();
        if(applications.length === 0) {
            setApplications(res?.applications);
        }
    }
    useEffect(() => {
        loadApplicationsFunc();
    }, []);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [deleteApplicationId, setDeleteApplicationId] = useState(false);

    const handleDelete = (id, e) => {
        e.stopPropagation();
        e.preventDefault();
        setShowDeleteAlert(true);
        setDeleteApplicationId(id);
    };

    const handleCloseAlert = () => {
        setShowDeleteAlert(false);

        setDeleteApplicationId(false);
    };

    const handleProceedDelete = () => {
        if (deleteApplicationId !== false) {
            deleteApplication(deleteApplicationId);
        }
        handleCloseAlert();
    };
    return (
        <section>
            <PortalPanel color="#EE6C3B">
                <div className="row justify-between">
                    <h2 
                        className="text-[22px] tracking-wide font-black mb-16" 
                        data-cy="applications-title"
                    >
                        Applications
                    </h2>
                    <BlackOutlinedButtonClient
                        onClick={() => createApplication(router)} data-cy="start-application"
                    >
                        Start a new application
                    </BlackOutlinedButtonClient>
                </div>
                {/* H3: text-neutral-800 text-lg leading-6 font-semibold m-0 md:text-2xl md:leading-8 */}

                {(applications || []).length === 0 ? (
                    <h3 
                        className="text-neutral-800 text-lg leading-6 font-semibold m-0 md:text-2xl md:leading-8"
                        data-cy="no-applications"
                    >
                        <br />
                        No Applications found
                    </h3>
                ) : (
                    <div className="grid grid-cols-12 gap-3">
                        {applications.map((app) => (
                            <div 
                                className="col-span-12 md:col-span-6 lg:col-span-4"
                                key={app.id} data-cy="application-wrapper"
                            >
                                <ApplicationPreview
                                    app={app}
                                    deleteApplicationCallback={handleDelete}
                                />
                            </div>
                        ))}
                    </div>
                )}

                <AlertDialog
                    title="Delete Application?"
                    description="This can't be undone, and you will have to deal with it in your afterlife"
                    open={showDeleteAlert}
                    handleClose={handleCloseAlert}
                    handleProceed={handleProceedDelete}
                />
            </PortalPanel>
        </section>
    );
}

export default ApplicationSection;
 