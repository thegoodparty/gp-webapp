'use client';

import PrimaryButton from '@shared/buttons/PrimaryButton';

export default function ClaimButton(props) {
  const { route } = props;
  return (
    <div className="mt-4 mb-2">
      <PrimaryButton variant="outlined" fullWidth>
        Claim Route
      </PrimaryButton>
    </div>
  );
}
