'use client';
import { FocusedExperienceWrapper } from 'app/(candidate)/dashboard/shared/FocusedExperienceWrapper';
import H1 from '@shared/typography/H1';
import Body2 from '@shared/typography/Body2';
import Link from 'next/link';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import TextField from '@shared/inputs/TextField';
import { useEffect, useState } from 'react';
import gpFetch from 'gpApi/gpFetch';
import gpApi from 'gpApi';
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { useRouter } from 'next/navigation';
import { AsyncValidationIcon } from 'app/(candidate)/dashboard/shared/AsyncValidationIcon';
import {
  EIN_PATTERN_FULL,
  EinCheckInput,
} from 'app/(candidate)/dashboard/pro-sign-up/committee-check/components/EinCheckInput';
import { AlreadyProUserPrompt } from 'app/(candidate)/dashboard/shared/AlreadyProUserPrompt';
import { CommitteeSupportingFilesUpload } from 'app/(candidate)/dashboard/pro-sign-up/committee-check/components/CommitteeSupportingFilesUpload';

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
  const [validatedEin, setValidatedEin] = useState(null);

  // We need to do this to determine if file was uploaded in the root bucket, or in a subfolder
  const filenameBits =
    campaign?.details?.einSupportingDocument?.split('/') || [];
  const [uploadedFilename, setUploadedFilename] = useState(
    filenameBits[1] || filenameBits[0] || '',
  );

  const validEINFormat = EIN_PATTERN_FULL.test(einInputValue);
  const inputsValid = campaignCommittee && validEINFormat;

  const doEinCheck = async () => {
    if (!inputsValid || loadingEinCheck) {
      return;
    }
    setLoadingEinCheck(true);
    const numericalEIN = Number(einInputValue.replace(/[^0-9.]/g, ''));
    try {
      const result = await gpFetch(gpApi.campaign.einCheck, {
        name: einInputValue,
        ein: numericalEIN,
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

  useEffect(() => {
    doEinCheck();
  }, [campaignCommittee, einInputValue]);

  const onCampaignCommitteeBlur = () =>
    doEinCheck(einInputValue, einInputValue);

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
      router.push('/dashboard/pro-sign-up/service-agreement');
      setLoadingCampaignUpdate(false);
    };

    doCampaignUpdate();
  };

  const onUploadSuccess = (uploadedFilename = '') =>
    uploadedFilename && setUploadedFilename(uploadedFilename);
  const onUploadError = (e) => {
    console.error('Error uploading file', e);
    setUploadedFilename('');
  };

  const nextDisabled =
    !(validatedEin && uploadedFilename) || loadingCampaignUpdate;

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
            name="campaign-committee"
            className="!mb-4"
            label="Name Of Campaign Committee"
            value={campaignCommittee}
            disabled={loadingEinCheck}
            onChange={(e) => setCampaignCommittee(e.target.value)}
            onBlur={onCampaignCommitteeBlur}
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
            name="ein-number"
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

          <CommitteeSupportingFilesUpload
            inputValue={uploadedFilename}
            onUploadSuccess={onUploadSuccess}
            onUploadError={onUploadError}
          />

          <section className="flex flex-col justify-between mt-4 md:mt-8 md:flex-row">
            <Link className="block mb-4 md:mb-0" href="/dashboard/pro-sign-up">
              <SecondaryButton className="w-full">Back</SecondaryButton>
            </Link>
            <PrimaryButton onClick={handleNextClick} disabled={nextDisabled}>
              Next
            </PrimaryButton>
          </section>
        </>
      )}
    </FocusedExperienceWrapper>
  );
};

export default CommitteeCheckPage;
