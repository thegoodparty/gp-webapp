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

export const CandidateLookupPage = ({}) => {
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const router = useRouter();

  const onChange = ({ currentTarget }) => {
    setEmail(currentTarget.value);
    setValidEmail(isValidEmail(currentTarget.value));
  };

  const handleNext = () => {
    router.push('/onboarding/managing/final');
  };

  return (
    <CardPageWrapper>
      <div className="text-center mb-4 pt-0">
        <H1>Let&apos;s look for them on GoodParty.org.</H1>
        <Body2 className="mt-3 mb-8">
          What is your candidates campaign email?
        </Body2>
      </div>

      <TextField
        {...{
          className: 'w-full',
          label: 'Candidate Email',
          value: email,
          onChange,
          shrink: true,
          placeholder: 'hello@email.com',
          required: true,
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
          href="/sign-up/account-type"
        >
          <SecondaryButton className="w-full">
            <div className="min-w-[120px]">Back</div>
          </SecondaryButton>
        </Link>
        <PrimaryButton
          onClick={handleNext}
          className="w-full mb-4 md:w-auto md:mb-auto"
          disabled={!validEmail}
        >
          <div className="min-w-[120px]">Send Request</div>
        </PrimaryButton>
      </div>
    </CardPageWrapper>
  );
};
