'use client';
/**
 *
 * ApplicationStep5
 *
 */

import React, { useState, useEffect } from 'react';
import ApplicationWrapper from './ApplicationWrapper';
import TopIssueRow from './TopIssueRow';

const initialState = {
    selectedTopic: null,
    selectedPosition: null,
    description: '',
};

function ApplicationStep5({
    step,
    application,
    updateApplicationCallback,
    reviewMode,
    issues,
}) {
    const [state, setState] = useState([
        initialState,
        initialState,
        initialState,
        initialState,
        initialState,
    ]);

    const [validIssues, setValidIssues] = useState(issues);

    useState(() => {
        setValidIssues(issues);
    }, [issues]);

    useEffect(() => {
        if (application?.topIssues) {
        setState(application.topIssues);
        }
    }, [application]);

    const canSubmit = () =>
        state &&
        state.length > 0 &&
        state[0].selectedTopic &&
        state[0].selectedPosition;

    const handleRowUpdate = (updatedRow, index) => {
        const newState = [...state];
        newState[index] = updatedRow;
        setState(newState);
        updateApplicationCallback(application.id, {
            ...application,
            topIssues: newState,
        });

        const filteredIssues = issues.filter((issue) => {
            let found = false;
            newState.forEach((row) => {
                if (row.selectedTopic?.id === issue.id) {
                found = true;
                }
            });
            return !found;
        });

        setValidIssues(filteredIssues);
    };

    return (
        <ApplicationWrapper
            step={step}
            canContinue={canSubmit()}
            id={application.id}
        >
            <h1
                className="text-xl mb-8 md:text-4xl"
                data-cy="step-title"
            >
                Step 5: Select Top Issues
            </h1>
            <div 
                className="text-stone-500 text-base leading-6 tracking-wide md:text-xl md:leading-7 mt-2" 
                data-cy="step-subtitle"
            >
                Please select up to top five (5) issue you are aligned with to help
                supporters distinguish your campaign.
            </div>
            <br />
            <br />
            {(state || []).map((row, index) => (
                <TopIssueRow
                    key={index}
                    issues={validIssues}
                    row={row}
                    index={index}
                    updateCallback={handleRowUpdate}
                />
            ))}
        </ApplicationWrapper>
    );
}

export default ApplicationStep5;
