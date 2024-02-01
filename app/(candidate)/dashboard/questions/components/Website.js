'use client';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import TextField from '@shared/inputs/TextField';
import H1 from '@shared/typography/H1';
import { isValidUrl } from 'helpers/linkhelper';

export default function Website({
  value,
  onChangeCallback,
  saveCallback,
  campaign,
  campaignKey,
}) {
  const handleSave = () => {
    if (!canSave()) return;
    const updated = {
      ...campaign,
      details: {
        ...campaign.details,
        [campaignKey]: value,
      },
    };
    saveCallback(updated);
  };
  const canSave = () => {
    return isValidUrl(value);
  };

  const handleSkip = () => {
    const updated = {
      ...campaign,
      details: {
        ...campaign.details,
        [campaignKey]: '',
      },
    };
    saveCallback(updated);
  };
  return (
    <div>
      <H1 className="mb-10">Campaign Website</H1>
      <TextField
        required
        label="Website URL"
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
        value={value}
        onChange={(e) => {
          onChangeCallback(campaignKey, e.target.value);
        }}
      />
      <div className="flex justify-center mt-10" onClick={handleSave}>
        <PrimaryButton className="mt-3" disabled={!canSave()}>
          Next
        </PrimaryButton>
      </div>
      <div className="flex justify-center mt-10 underline" onClick={handleSkip}>
        Skip for now
      </div>
    </div>
  );
}
