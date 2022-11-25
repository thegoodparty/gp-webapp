'use client';
/**
 *
 * ApplicationStep4
 *
 */

import React, { useState, useEffect } from 'react';
import TextField from '@shared/inputs/TextField';
import InputAdornment from '@mui/materialInputAdornment';
import ApplicationWrapper from './ApplicationWrapper';
import { step2Socials, step3Socials } from './fields';
import styles from './ApplicationStep4.module.scs';


const keys = {};

step2Socials.forEach((field) => {
    keys[field.key] = field.defaultValue;
});
step3Socials.forEach((field) => {
    keys[field.key] = field.defaultValue;
});

function ApplicationStep4({
    step,
    application,
    updateApplicationCallback,
    reviewMode,
}) {
    const [state, setState] = useState(keys);

    useEffect(() => {
        if (application?.socialMedia) {
            setState({
                ...application.socialMedia,
            });
        }
    }, [application]);

    const handleSubmitForm = (e) => e.stopPropagation();

    const onChangeField = (key, e) => {
        setState({
            ...state,
            [key]: e.target.value,
        });
    };

    const onBlurField = (key, e) => {
        const updatedState = {
            ...state,
            [key]: e.target.value,
        };
        updateApplicationCallback(application.id, {
            ...application,
            socialMedia: {
                ...updatedState,
            },
        });
    };
    return (
        <ApplicationWrapper
            step={step}
            canContinue={true}
            id={application.id}
            reviewMode={reviewMode}
        >
            <h1
                className="text-xl mb-8 md:text-4xl"
                data-cy="step-title"
            >
                Step 4: Add Social Media
            </h1>
            <form noValidate onSubmit={handleSubmitForm}>
                <div className="text-black text-base leading-6 tracking-wide md:text-xl md:leading-7 mb-2 font-semibold">
                    Official campaign social media links
                </div>
                {step3Socials.map((field) => (
                    <div 
                        className={styles.socialFieldWrapper} 
                        key={field.key} 
                        data-cy="social-step-3-wrapper"
                    >
                        <TextField
                            key={field.key}
                            name={field.key}
                            variant="outlined"
                            value={state[field.key]}
                            fullWidth
                            placeholder={field.placeholder}
                            disabled={reviewMode}
                            inputProps={{
                                maxLength: 50,
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        {field.icon} &nbsp;
                                        {field.adornment}
                                    </InputAdornment>
                                ),
                            }}
                            onChange={(e) => {
                                onChangeField(field.key, e);
                            }}
                            onBlur={(e) => {
                                onBlurField(field.key, e);
                            }}
                            data-cy="social-step-3"
                        />
                    </div>
                ))}
                <br />
                <br />
                <div 
                    className="text-black text-base leading-6 tracking-wide md:text-xl md:leading-7 mb-2 font-semibold" 
                    data-cy="step-subtitle">
                        Personal social media links for the candidate
                </div>
                {step2Socials.map((field) => (
                    <div 
                        className={styles.socialFieldWrapper}  
                        key={field.key} 
                        data-cy="social-step-2-wrapper"
                    >
                        <TextField
                            key={field.key}
                            name={field.key}
                            variant="outlined"
                            value={state[field.key]}
                            fullWidth
                            placeholder={field.placeholder}
                            disabled={reviewMode}
                            inputProps={{
                                maxLength: 50,
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        {field.icon} &nbsp;
                                        {field.adornment}
                                    </InputAdornment>
                                ),
                            }}
                            onChange={(e) => {
                                onChangeField(field.key, e);
                            }}
                            onBlur={(e) => {
                                onBlurField(field.key, e);
                            }}
                            data-cy="social-step-2"
                        />
                    </div>
                ))}
            </form>
        </ApplicationWrapper>
    );
}


export default ApplicationStep4;
