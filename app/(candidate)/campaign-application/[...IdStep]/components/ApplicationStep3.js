'use client';
/**
 *
 * ApplicationStep3
 *
 */

import React, { useState, useEffect } from 'react';
import TextField from '@shared/inputs/TextField';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import InputAdornment from '@mui/material/InputAdornment';
import { FaImage } from 'react-icons/fa';
import Autocomplete from '@mui/material/Autocomplete';
import { FaTrash } from 'react-icons/fa';
import ImageUpload from '@shared/utils/ImageUpload';
import ApplicationWrapper from './ApplicationWrapper';
import { step3Fields } from './fields';
import YouTubeInput from '@shared/inputs/YouTubeInput';

const keys = {};
const requiredKeys = [{ key: 'headshotPhoto', defaultValue: '' }];
step3Fields.forEach((field) => {
    keys[field.key] = field.defaultValue;
    if (field.required) {
        requiredKeys.push(field);
    }
});

function ApplicationStep3({
    step,
    application,
    updateApplicationCallback,
    reviewMode,
}) {
    const [state, setState] = useState(keys);

    useEffect(() => {
        if (application?.campaign) {
            setState({
                ...application.campaign,
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
            campaign: {
                ...updatedState,
            },
        });
    };

    const handleRadioChange = (key, e) => {
        onChangeField(key, e);
        onBlurField(key, e);
    };

    const canSubmit = () => {
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

    const onChangeYoutube = (url, youTubeId) => {
        const e = {
            target: {
                value: youTubeId || '',
            },
        };
        onChangeField('campaignVideo', e);
        onBlurField('campaignVideo', e);
    };

    const handleUploadImage = (image, key) => {
        const e = {
            target: {
                value: image,
            },
        };

        onBlurField(key, e);
    };

    const handleDeleteImage = (key) => {
        const e = {
            target: {
                value: '',
            },
        };

        onBlurField(key, e);
    };

    const handleDateChange = (key, date) => {
        // const formatted = dateUsHelper(date);
        const e = { target: { value: date } };
        onChangeField(key, e);
        onBlurField(key, e);
    };

    const renderField = (field) => {
        if (field.key === 'headshotPhoto') {
        return (
            <div 
                key={field.key} 
                className={`mb-8 ${field.grayBg && 'bg-neutral-100 p-4 rounded-lg'}`}
            >
                <div className="text-black text-base leading-6 tracking-wide md:text-xl md:leading-7 mb-2 font-semibold">
                {field.label} 
                    {field.required && 
                        <div className="text-xs leading-4 tracking-wider md:text-sm md:leading-5 inline-block ml-2 text-pink-600 font-medium">
                            Required
                        </div>
                    }
                    {field.subLabel && 
                        <div className="text-xs leading-4 tracking-wider md:text-sm md:leading-5 inline-block ml-2 text-pink-600 font-medium">
                            {field.subLabel}
                        </div>
                    }
                </div>
                <div className="mb-3 text-stone-500">
                    {field.subtitle}
                </div>
                {state[field.key] ? (
                    <div className="relative text-center w-full inline-block md:w-[33%]">
                        <img 
                            className="w-full h-auto rounded-xl" 
                            src={state[field.key]} 
                            alt={field.key} />
                        <div 
                            className="absolute top-[10px] right-[10px] p-1 text-red-600 cursor-pointer" 
                            style={{
                                textShadow: "0 0 3px rgba(0, 0, 0, 0.3)"
                            }}
                            onClick={() => handleDeleteImage(field.key)}
                        >
                            <FaTrash />
                        </div>
                    </div>
                ) : (
                    <>
                    {!reviewMode && (
                        <div 
                            className="py-2.5 px-4 border-stone-300 border-2 border-solid rounded text-right relative mb-3" 
                            key={field.key}
                        >
                            <div className="relative z-10">
                                <ImageUpload
                                    uploadCallback={(image) =>
                                        handleUploadImage(image, field.key)
                                    }
                                    maxFileSize={1000000}
                                />
                            </div>
                            <div className="absolute opacity-40 top-[6px] left-3 h-11 flex items-center">
                                <div className="text-black text-2xl mr-4">
                                    <FaImage style={{ marginTop: '6px' }} />
                                </div>
                                {field.label}
                            </div>
                        </div>
                    )}{' '}
                    </>
                )}
            </div>
        );
        }
        let maxLength = field.maxLength || 120;
        if (field.multiline) {
            maxLength = field.maxLength || 300;
        }

        return (
            <div 
                key={field.key} 
                className={`mb-8 ${field.grayBg && 'bg-neutral-100 p-4 rounded-lg'}`}
            >
                {!field.noLabel && (
                    <div className="text-black text-base leading-6 tracking-wide md:text-xl md:leading-7 mb-2 font-semibold">
                        {field.label} 
                        {field.required && 
                            <div className="text-xs leading-4 tracking-wider md:text-sm md:leading-5 inline-block ml-2 text-pink-600 font-medium">
                                Required
                            </div>
                        }
                        {field.subLabel && 
                            <div className="text-xs leading-4 tracking-wider md:text-sm md:leading-5 inline-block ml-2 text-pink-600 font-medium">
                                {field.subLabel}
                            </div>
                        }
                    </div>
                )}
                {field.type === 'select' && (
                <>
                    {field.key === 'state' ? (
                    <Autocomplete
                        options={field.options}
                        value={state[field.key]}
                        // getOptionLabel={item => item.name}
                        fullWidth
                        variant="outlined"
                        renderInput={(params) => (
                            <TextField {...params} label="State" variant="outlined" />
                        )}
                        onChange={(event, item) => {
                            const e = { target: { value: item } };
                            onChangeField(field.key, e);
                            onBlurField(field.key, e);
                        }}
                    />
                    ) : (
                    <Select
                        native
                        value={state[field.key]}
                        fullWidth
                        variant="outlined"
                        disabled={reviewMode}
                        onChange={(e) => {
                            onChangeField(field.key, e);
                        }}
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
                </>
                )}
                {field.subtitle && 
                    <div className="mb-3 text-stone-500">
                        {field.subtitle}
                    </div>
                }
                {field.type === 'text' && (
                    <TextField
                        name={field.label}
                        variant="outlined"
                        value={state[field.key]}
                        fullWidth
                        required={field.required}
                        placeholder={field.placeholder}
                        multiline={!!field.multiline}
                        rows={field.multiline ? 5 : 1}
                        disabled={reviewMode}
                        inputProps={{
                            maxLength,
                        }}
                        InputProps={
                        field.icon && {
                            startAdornment: (
                                <InputAdornment position="start">{field.icon}</InputAdornment>
                            ),
                        }
                        }
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
                        onChange={(e) => handleRadioChange(field.key, e)}
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
                {/* TODO: Fix this! */}

                {field.type === 'date' && (
                    <TextField
                        variant="outlined"
                        fullWidth
                        type="date"
                        value={state[field.key]}
                        onChange={(ev) => {
                            handleDateChange(field.key, ev.target.value);
                        }}
                    />
                )}

                {field.type === 'youtube' && (
                    <YouTubeInput
                        initialId={state[field.key]}
                        onChangeCallback={onChangeYoutube}
                    />
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
            Step 3: Add Campaign Details
        </h1>
        <form noValidate onSubmit={handleSubmitForm}>
            {step3Fields.map((field) => (
                <React.Fragment key={field.key}>{renderField(field)}</React.Fragment>
            ))}
        </form>
        </ApplicationWrapper>
    );
}

export default ApplicationStep3;
