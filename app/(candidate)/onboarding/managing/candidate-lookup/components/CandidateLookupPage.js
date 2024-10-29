'use client';
import H1 from '@shared/typography/H1';
import Body2 from '@shared/typography/Body2';
import CardPageWrapper from '@shared/cards/CardPageWrapper';
import TextField from '@shared/inputs/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { MdOutlineMailOutline } from 'react-icons/md';
import { useState } from 'react';
import { isValidEmail } from '@shared/inputs/EmailInput';
import Link from 'next/link';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { useRouter } from 'next/navigation';
import gpFetch from 'gpApi/gpFetch';
import gpApi from 'gpApi';
import { useSnackbar } from 'helpers/useSnackbar';

export const CandidateLookupPage = ({ user }) => {
  const { email: userEmail } = user;
  const [candidateEmail, setCandidateEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { errorSnackbar } = useSnackbar();

  const isSameAsUserEmail =
    candidateEmail && userEmail && candidateEmail === userEmail;
  const disableNext = !validEmail || isSameAsUserEmail || loading;

  const onChange = ({ currentTarget }) => {
    setCandidateEmail(currentTarget.value);
    setValidEmail(isValidEmail(currentTarget.value));
  };

  const handleNext = async () => {
    setLoading(true);
    const newRequest = await gpFetch(gpApi.campaign.campaignRequests.create, {
      candidateEmail,
      role: 'manager',
    });
    setLoading(false);
    if (!newRequest || newRequest.ok === false) {
      const message = 'Error creating campaign request';
      console.error(message);
      errorSnackbar(message);
    } else {
      router.push('/onboarding/managing/final');
    }
  };

  return (
    <CardPageWrapper>
      <div className="text-center mb-4 pt-0">
        <H1>Let&apos;s look for the campaign on GoodParty.org</H1>
        <Body2 className="mt-3 mb-8">
          What is your candidates campaign email?
        </Body2>
      </div>

      <TextField
        {...{
          className: 'w-full',
          label: 'Candidate Email',
          value: candidateEmail,
          onChange,
          shrink: true,
          placeholder: 'hello@email.com',
          required: true,
          error: isSameAsUserEmail,
          helperText: isSameAsUserEmail
            ? "It looks like you've entered your email address, please enter the candidate's email address associated with the campaign."
            : undefined,
          InputProps: {
            startAdornment: (
              <InputAdornment className="text-black" position="start">
                <MdOutlineMailOutline />
              </InputAdornment>
            ),
          },
        }}
      />

      <div className="flex flex-wrap items-center justify-between mt-8">
        <Link
          className="w-full mb-4 md:w-auto md:mb-auto"
          href="/onboarding/account-type"
        >
          <SecondaryButton className="w-full">
            <div className="min-w-[120px]">Back</div>
          </SecondaryButton>
        </Link>
        <PrimaryButton
          loading={loading}
          onClick={handleNext}
          className="w-full mb-4 md:w-auto md:mb-auto"
          disabled={disableNext}
        >
          <div className="min-w-[120px]">Send Request</div>
        </PrimaryButton>
      </div>
    </CardPageWrapper>
  );
};
