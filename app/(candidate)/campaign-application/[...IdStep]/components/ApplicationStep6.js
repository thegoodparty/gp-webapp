'use client';
/**
 *
 * ApplicationStep6
 *
 */

import React, { useState, useEffect } from 'react';
import TextField from '@shared/inputs/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { FaLink } from 'react-icons/fa';
import ImageUploadWrapper from '@shared/utils/ImageUpload';
import BlackButtonClient from '@shared/buttons/BlackButtonClient';
import ApplicationWrapper from './ApplicationWrapper';

const fields = [
  {
    title: {
      key: 'title',
      label: 'Endorsement Title',
      placeholder: 'Enter...',
      defaultValue: '',
      type: 'text',
    },
    body: {
      key: 'body',
      label: 'Endorsement Summary',
      subtitle: 'A snippet or summary of the endorsement.',
      placeholder: 'Enter...',
      defaultValue: '',
      type: 'text',
      multiline: true,
    },
    link: {
      key: 'link',
      label: 'Proof of endorsement',
      subtitle:
        'For example a statement on the organization’s website or a newspaper article',
      placeholder: 'Enter...',
      defaultValue: '',
      type: 'text',
      icon: (
        <span className="bg-black text-white rounded-sm pt-1 pb-0.5 px-1 text-lg mr-4">
          <FaLink />
        </span>
      ),
    },
    image: {
      key: 'image',
      label: 'Image',
      subtitle: 'Add image of endorsing organization’s logo',
      type: 'image',
    },
  },
];
const emptyKeys = { body: '', link: '', title: '', image: '' };

const keys = [emptyKeys];

function ApplicationStep6({
  step,
  application,
  updateApplicationCallback,
  reviewMode,
}) {
  const [state, setState] = useState(keys);
  const [fieldsState, setFieldsState] = useState(fields);

  useEffect(() => {
    if (application?.endorsements) {
      setState(application.endorsements);
      if (application.endorsements.length > 1) {
        // we need to add fields
        const newFields = [];

        for (let i = 0; i < application.endorsements.length; i++) {
          newFields.push(fields[0]);
        }
        setFieldsState(newFields);
      }
    }
  }, [application]);

  const handleSubmitForm = (e) => e.stopPropagation();

  const onChangeField = (key, e, index) => {
    const updatedState = JSON.parse(JSON.stringify(state));
    updatedState[index][key] = e.target.value;
    setState(updatedState);
  };
  const handleUploadImage = (key, image, index) => {
    const updatedState = JSON.parse(JSON.stringify(state));
    updatedState[index][key] = image;
    setState(updatedState);

    updateApplicationCallback(application.id, {
      ...application,
      endorsements: updatedState,
    });
  };

  const onBlurField = (key, e, index) => {
    const updatedState = JSON.parse(JSON.stringify(state));
    updatedState[index][key] = e.target.value;

    updateApplicationCallback(application.id, {
      ...application,
      endorsements: updatedState,
    });
  };

  const handleAddMore = () => {
    const newFields = { ...fields[0] };
    const updatedFieldState = [...fieldsState, newFields];
    setFieldsState(updatedFieldState);

    const updatedSate = [...state, emptyKeys];
    setState(updatedSate);
  };

  const canSubmit = () => {
    for (let i = 0; i < state.length; i++) {
      const endors = state[i];
      if (endors.body !== '' || endors.title !== '') {
        if (endors.body === '' || endors.title === '') {
          return false;
        }
      }
    }
    return true;
  };

  const renderField = (field, index) => {
    return (
        <div 
            key={field.key} 
            className={`mb-8 ${field.grayBg && 'bg-neutral-100 p-4 rounded-lg'}`}
        >
        <div className="text-stone-500 text-base leading-6 tracking-wide md:text-xl md:leading-7 mt-2">
            {field.label}
        </div>
        <div className="mb-3 text-stone-500">
            {field.subtitle}
        </div>
        {(field.type === 'text' || field.type === 'email') && (
            <TextField
                name={field.label}
                variant="outlined"
                value={state[index][field.key]}
                fullWidth
                type={field.type}
                required={field.required}
                placeholder={field.placeholder}
                multiline={!!field.multiline}
                rows={field.multiline ? 5 : 1}
                inputProps={{ maxLength: field.multiline ? 300 : 120 }}
                disabled={reviewMode}
                InputProps={
                    field.icon && {
                        startAdornment: (
                            <InputAdornment position="start">{field.icon}</InputAdornment>
                        ),
                    }
                }
                onChange={(e) => {
                    onChangeField(field.key, e, index);
                }}
                onBlur={(e) => {
                    onBlurField(field.key, e, index);
                }}
                className="!bg-white"
            />
        )}
        {field.type === 'image' && (
            <>
            {state[index][field.key] ? (
                <img src={state[index][field.key]} style={{ width: '200px' }} />
            ) : (
                <ImageUploadWrapper
                    uploadCallback={(image) =>
                        handleUploadImage(field.key, image, index)
                    }
                />
            )}
            </>
        )}
        </div>
    );
  };
  return (
    <ApplicationWrapper
      step={step}
      canContinue={canSubmit()}
      id={application.id}
      withWhiteBg={false}
      reviewMode={reviewMode}
    >
        <h1
            className="text-xl mb-8 md:text-4xl"
            data-cy="step-title"
        >
                Step 6: Highlight Key Endorsements
        </h1>
        <form noValidate onSubmit={handleSubmitForm}>
            <div
                className="text-black text-base leading-6 tracking-wide md:text-xl md:leading-7"
                data-cy="step-description"
            >
                Use this page to add any institutional endorsements you may have
                received and want to highlight to voters. For example, your local
                rotary club, labor union, chamber of commerce, etc. Add endorsements
                one at a time.
            </div>
            <br />
            {fieldsState.map((field, index) => (
                <div 
                    className="bg-white rounded-lg p-4 mb-4 md:p-6" 
                    style={{
                        boxShadow: "1px 1px 1px rgba(0, 0, 0, 0.04), 0 0 2px rgba(0, 0, 0, 0.06),  0 0 1px rgba(0, 0, 0, 0.04)"
                    }}
                    key={index}
                >
                    {renderField(field.title, index)}
                    {renderField(field.body, index)}
                    {renderField(field.link, index)}
                    {renderField(field.image, index)}
                </div>
            ))}
            {!reviewMode && (
                <BlackButtonClient onClick={handleAddMore}>
                    <div
                        className="text-white text-xs leading-4 tracking-wider md:text-sm md:leading-5" 
                    >
                        &nbsp;&nbsp;Add more endorsements&nbsp;&nbsp;
                    </div>
                </BlackButtonClient>
            )}
        </form>
    </ApplicationWrapper>
  );
}

export default ApplicationStep6;
