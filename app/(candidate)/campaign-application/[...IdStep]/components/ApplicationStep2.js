'use client';
/**
 *
 * ApplicationStep2
 *
 */

import React, { useState, useEffect } from 'react';
import TextField from '@shared/inputs/TextField';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';

import ApplicationWrapper from './ApplicationWrapper';
import OfficeSelector from './OfficeSelector';
import ElectedOfficeSelector from './ElectedOfficeSelector';

import { step2fields, step2Socials } from './fields';
import PhoneInput, { isValidPhone } from '@shared/inputs/PhoneInput';


const keys = {};
const requiredKeys = [];
step2fields.forEach((field) => {
    keys[field.key] = field.defaultValue;
    if (field.required) {
        requiredKeys.push(field);
    }
});

step2Socials.forEach((field) => {
    keys[field.key] = field.defaultValue;
});

function ApplicationStep2({
    step,
    application,
    updateApplicationCallback,
    reviewMode,
}) {
    const [state, setState] = useState(keys);
    const [hiddenElements, setHiddenElements] = useState({
        publicOffice: true,
        officeElected: true,
        partyHistory: true,
    });

    useEffect(() => {
        if (application?.candidate) {
            setState({
                ...application.candidate,
            });
            setHiddenElements({
                publicOffice: application.candidate.ranBefore !== 'Yes',
                officeElected: application.candidate.electedBefore !== 'Yes',
                partyHistory: application.candidate.memberPolitical !== 'Yes',
                otherParty: application.candidate.party !== 'Other',
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
            candidate: {
                ...updatedState,
            },
        });
    };

    const handleRadioChange = (key, e, toggleElement) => {
        if (toggleElement && e.target.value === 'Yes') {
            setHiddenElements({
                ...hiddenElements,
                [toggleElement]: false,
            });
        }
        if (toggleElement && e.target.value === 'No') {
            setHiddenElements({
                ...hiddenElements,
                [toggleElement]: true,
            });
        }
        onChangeField(key, e);
        onBlurField(key, e);
    };

    const handleSelectChange = (key, e, toggleElement) => {
        if (key === 'party') {
            if (toggleElement && e.target.value === 'Other') {
                setHiddenElements({
                    ...hiddenElements,
                    [toggleElement]: false,
                });
            } else if (toggleElement && e.target.value !== 'Other') {
                setHiddenElements({
                    ...hiddenElements,
                    [toggleElement]: true,
                });
            }
        }
        onChangeField(key, e);
        onBlurField(key, e);
    };

    const handlePhoneChange = (key, val) => {
        setState({
            ...state,
            [key]: val,
        });
    };

    const canSubmit = () => {
        if(!isValidPhone(state.candidatePhone)){
            return false;
        }
        let returnVal = true;
        requiredKeys.forEach((field) => {
            if (
                typeof state[field.key] === 'undefined' ||
                state[field.key] === field.defaultValue
            ) {
                returnVal = false;
            }
        });
        return returnVal;
    };

    const renderField = (field) => {
        if (field.hidden && hiddenElements[field.key]) {
            return;
        }
        let maxLength = field.maxLength || 120;
        if (field.multiline) {
            maxLength = 300;
        }
        if (field.hidden && !hiddenElements[field.key]) {
            if (field.key === 'publicOffice') {
                return (
                    <div className='mb-8'>
                        <OfficeSelector
                            application={application}
                            updateApplicationCallback={updateApplicationCallback}
                        />
                    </div>
                );
            }
            if (field.key === 'officeElected') {
                return (
                <div className='mb-8'>
                    <ElectedOfficeSelector
                        application={application}
                        updateApplicationCallback={updateApplicationCallback}
                    />
                </div>
                );
            }
            if (field.key === 'partyHistory' || field.key === 'otherParty') {
                return (
                    <div className='mb-8' key={field.key}>
                        <div className="text-black text-base leading-6 tracking-wide md:text-xl md:leading-7 mb-2 font-semibold">
                            {field.label} 
                            {field.required && 
                                <div className="text-xs leading-4 tracking-wider md:text-sm md:leading-5 inline-block ml-2 font-medium text-pink-600">Required</div>
                            }
                        </div>
                        <TextField
                            name={field.label}
                            variant="outlined"
                            value={state[field.key]}
                            fullWidth
                            required={field.required}
                            disabled={reviewMode}
                            placeholder={field.placeholder}
                            inputProps={{ maxLength }}
                            multiline={!!field.multiline}
                            rows={field.multiline ? 5 : 1}
                            onChange={(e) => {
                                onChangeField(field.key, e);
                            }}
                            onBlur={(e) => {
                                onBlurField(field.key, e);
                            }}
                        />
                    </div>
                );
            }

            return <div className='mb-8'>{field.customElement}</div>;
        }

        return (
            <div className='mb-8' key={field.key}>
                <div className="text-black text-base leading-6 tracking-wide md:text-xl md:leading-7 mb-2 font-semibold">
                    {field.label} 
                    {field.required && 
                        <div 
                            className="text-xs leading-4 tracking-wider md:text-sm md:leading-5 inline-block ml-2 font-medium text-pink-600"
                        >
                            Required
                        </div>
                    }
                </div>
                {field.type === 'select' && (
                    <Select
                        native
                        value={state[field.key]}
                        fullWidth
                        variant="outlined"
                        disabled={reviewMode}
                        onChange={(e) =>
                        handleSelectChange(field.key, e, field.toggleElement)
                        }
                        onBlur={(e) => {
                        onBlurField(field.key, e);
                        }}
                    >
                        <option value="">Select</option>
                        {field.options.map((op) => (
                            <option value={op} key={op}>
                                {op}
                            </option>
                        ))}
                    </Select>
                )}
                {field.type === 'phone' && (
                    <PhoneInput
                        value={state[field.key]}
                        onChangeCallback={(val, isValid) => {
                        handlePhoneChange(field.key, val, isValid);
                        }}
                        onBlurCallback={(val) => {
                        const e = { target: { value: val } };
                        onBlurField(field.key, e);
                        }}
                        hideIcon
                    />
                )}
                {(field.type === 'text' || field.type === 'email' || field.type === 'date') && (
                    <TextField
                        name={field.label}
                        variant="outlined"
                        value={state[field.key]}
                        type={field.type}
                        fullWidth
                        required={field.required}
                        disabled={reviewMode}
                        placeholder={field.placeholder}
                        inputProps={{ maxLength }}
                        multiline={!!field.multiline}
                        rows={field.multiline ? 5 : 1}
                        onChange={(e) => {
                            onChangeField(field.key, e);
                        }}
                        onBlur={(e) => {
                            onBlurField(field.key, e);
                        }}
                    />
                )}
                {field.type === 'radio' && (
                    <RadioGroup
                        name={state[field.key]}
                        value={state[field.key]}
                        style={{ flexDirection: 'row' }}
                        onChange={(e) =>
                        handleRadioChange(field.key, e, field.toggleElement)
                        }
                    >
                        {field.options.map((op) => (
                        <FormControlLabel
                            style={{ display: 'inline-block' }}
                            value={op}
                            key={op}
                            control={<Radio color="primary" />}
                            label={op}
                            disabled={reviewMode}
                        />
                        ))}
                    </RadioGroup>
                )}
            </div>
        );
    };
    return (
        <ApplicationWrapper
            step={step}
            canContinue={canSubmit()}
            id={application.id}
            reviewMode={reviewMode}
        >
            <h1
                className="text-xl mb-8 md:text-4xl"
                data-cy="step-title"
            >
                Step 2: Add Candidate Details
            </h1>
            <form noValidate onSubmit={handleSubmitForm}>
                {step2fields.map((field) => (
                    <React.Fragment key={field.key} data-cy="step-field">{renderField(field)}</React.Fragment>
                ))}
            </form>
        </ApplicationWrapper>
    );
}

export default ApplicationStep2;
