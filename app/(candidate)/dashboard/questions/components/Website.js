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
        [campaignKey]: 'skipped',
      },
    };
    saveCallback(updated);
  };
  return (
    <div>
      <form noValidate onSubmit={(e) => e.preventDefault()}>
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
          helperText="Please provide a full url starting with http"
        />
        <div className="flex justify-center mt-10" onClick={handleSave}>
          <PrimaryButton className="mt-3" disabled={!canSave()} type="submit">
            Next
          </PrimaryButton>
        </div>
      </form>
      <div
        className="flex justify-center mt-10 underline cursor-pointer"
        onClick={handleSkip}
      >
        Skip for now
      </div>
    </div>
  );
}
