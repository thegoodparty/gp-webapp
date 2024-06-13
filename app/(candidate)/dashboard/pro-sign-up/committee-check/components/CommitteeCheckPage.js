'use client';
import { FocusedExperienceWrapper } from 'app/(candidate)/dashboard/shared/FocusedExperienceWrapper';
import H1 from '@shared/typography/H1';
import Body2 from '@shared/typography/Body2';
import Link from 'next/link';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import TextField from '@shared/inputs/TextField';
import React, { useEffect, useRef, useState } from 'react';
import gpFetch from 'gpApi/gpFetch';
import gpApi from 'gpApi';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { useRouter } from 'next/navigation';
import { AsyncValidationIcon } from 'app/(candidate)/dashboard/shared/AsyncValidationIcon';
import { HiddenFileUploadInput } from '@shared/inputs/HiddenFileUploadInput';
import {
  EIN_PATTERN_FULL,
  EinCheckInput,
} from 'app/(candidate)/dashboard/pro-sign-up/committee-check/components/EinCheckInput';
import { CircularProgress } from '@mui/material';
import { AlreadyProUserPrompt } from 'app/(candidate)/dashboard/shared/AlreadyProUserPrompt';

const COMMITTEE_HELP_MESSAGE = (
  <span>
    A committee name is necessary for legal documentation and transparency in
    financial transactions related to the campaign
    <br />
    <br />
    Use the same committee name when you filed for office.
  </span>
);

const CommitteeCheckPage = ({ campaign = { details: {} } }) => {
  const router = useRouter();
  const [campaignCommittee, setCampaignCommittee] = useState(
    campaign?.details?.campaignCommittee || '',
  );
  const [einInputValue, setEinInputValue] = useState(
    campaign?.details?.einNumber || '',
  );
  const [loadingEinCheck, setLoadingEinCheck] = useState(false);
  const [loadingCampaignUpdate, setLoadingCampaignUpdate] = useState(false);
  const [loadingFileUpload, setLoadingFileUpload] = useState(false);
  const [validatedEin, setValidatedEin] = useState(null);
  const fileInputRef = useRef(null);
  const [fileInfo, setFileInfo] = useState(null);

  useEffect(() => {
    const validEINFormat = EIN_PATTERN_FULL.test(einInputValue);
    const inputsValid = campaignCommittee && validEINFormat;

    const doEinCheck = async () => {
      const numericalEIN = Number(einInputValue.replace(/[^0-9.]/g, ''));
      try {
        const result = await gpFetch({
          ...gpApi.campaign.einCheck,
          url: `${gpApi.campaign.einCheck.url}?name=${einInputValue}&ein=${numericalEIN}`,
        });
        const { valid } = await result.json();
        setValidatedEin(valid);
      } catch (e) {
        console.error('Request to check EIN failed.');
        throw e;
      } finally {
        setLoadingEinCheck(false);
      }
    };

    if (inputsValid && !loadingEinCheck) {
      setLoadingEinCheck(true);
      doEinCheck(einInputValue, einInputValue);
    }
  }, [campaignCommittee, einInputValue]);

  const handleNextClick = async () => {
    const doCampaignUpdate = async () => {
      setLoadingCampaignUpdate(true);
      await updateCampaign([
        {
          key: 'details.einNumber',
          value: einInputValue,
        },
        {
          key: 'details.validatedEin',
          value: validatedEin,
        },
      ]);
      router.push('/dashboard/pro-sign-up/purchase-redirect');
      setLoadingCampaignUpdate(false);
    };

    doCampaignUpdate();
  };

  const onFileBrowseClick = (e) => {
    fileInputRef.current.click();
  };

  const handleFileChoose = async (fileData, file) => {
    setLoadingFileUpload(true);
    setFileInfo(file);
    const formData = new FormData();
    formData.append('document', file);
    try {
      await gpFetch(
        gpApi.campaign.einSupportingDocumentUpload,
        formData,
        null,
        null,
        true,
      );
    } catch (e) {
      console.error('Error uploading file', e);
    } finally {
      setLoadingFileUpload(false);
    }
  };

  return (
    <FocusedExperienceWrapper>
      {campaign.isPro ? (
        <AlreadyProUserPrompt />
      ) : (
        <>
          <H1 className="text-center mb-4">
            Great, and we just need a few more pieces of information.
          </H1>
          <Body2 className="text-center mb-8">
            The requested information is legally required in order to receive
            election data.
          </Body2>
          <TextField
            className="mb-4"
            label="Name Of Campaign Committee"
            value={campaignCommittee}
            disabled={loadingEinCheck}
            onChange={(e) => setCampaignCommittee(e.target.value)}
            InputProps={{
              endAdornment: (
                <AsyncValidationIcon
                  message={COMMITTEE_HELP_MESSAGE}
                  loading={loadingEinCheck}
                  validated={validatedEin}
                />
              ),
            }}
            fullWidth
          />
          <EinCheckInput
            loading={loadingEinCheck}
            value={einInputValue}
            validated={validatedEin}
            setValidated={setValidatedEin}
            onChange={setEinInputValue}
          />
          {validatedEin === false && (
            <Body2 className="text-error my-4 text-center">
              The provided EIN does not appear to match the given registered
              committee name. Please check your values and try again or contact{' '}
              <Link className="text-black underline" href="/contact">
                Customer Support
              </Link>
              .
            </Body2>
          )}
          <div className="grid grid-cols-10 gap-4">
            <TextField
              className="cursor-pointer col-span-10 md:col-span-7"
              value={fileInfo?.name}
              onClick={onFileBrowseClick}
              placeholder="Upload supporting documentation"
              disabled={loadingFileUpload}
            />

            <PrimaryButton
              component="label"
              className="flex items-center justify-center col-span-10 md:col-span-3"
              role={undefined}
              variant="outlined"
              onClick={onFileBrowseClick}
              disabled={loadingFileUpload}
              fullWidth
            >
              <span>Browse</span>
              {loadingFileUpload && (
                <CircularProgress
                  className="text-primary-light ml-2"
                  size={16}
                />
              )}
              <HiddenFileUploadInput
                ref={fileInputRef}
                onChange={handleFileChoose}
                accept=".pdf"
              />
            </PrimaryButton>
          </div>

          <section className="flex flex-col justify-between mt-8 md:flex-row">
            <Link className="block mb-4 md:mb-0" href="/dashboard/pro-sign-up">
              <SecondaryButton className="w-full">Back</SecondaryButton>
            </Link>
            <PrimaryButton
              onClick={handleNextClick}
              disabled={!validatedEin || loadingCampaignUpdate}
            >
              Next
            </PrimaryButton>
          </section>
        </>
      )}
    </FocusedExperienceWrapper>
  );
};

export default CommitteeCheckPage;
