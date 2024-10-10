'use client';
import { Select } from '@mui/material';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import RadioList from '@shared/inputs/RadioList';

const defaultScripts = [
  'why',
  'aboutMe',
  'slogan',
  'policyPlatform',
  'communicationsStrategy',
  'messageBox',
  'mobilizing',
  'pathToVictory',
  'campaignPlanAttempts',
  'generationStatus',
];

export default function ScheduleFlowStep3({
  onChangeCallback,
  nextCallback,
  backCallback,
  campaign,
  script,
}) {
  const [options, setOptions] = useState([]);
  useEffect(() => {
    if (campaign) {
      let nonDefaultScripts = campaign.aiContent || {};
      // filter default scripts nonDefaultScripts is an object
      defaultScripts.forEach((script) => {
        delete nonDefaultScripts[script];
      });
      let arr = [];
      for (const [key, value] of Object.entries(nonDefaultScripts)) {
        arr.push({ key, ...value });
      }
      setOptions(arr.sort((a, b) => b.updatedAt - a.updatedAt));
    }
  }, [campaign]);

  const handleSelect = (key) => {
    onChangeCallback('script', key);
  };

  return (
    <div className="p-4 w-[80vw] max-w-xl">
      <div className="text-center">
        <H1>Add a Script</H1>
        <Body1 className="mt-4 mb-8">
          How would you like to add your script?
        </Body1>

        <div className="mt-6 text-left">
          <RadioList
            {...{
              options: [
                {
                  key: 'saved',
                  label: 'Use a saved script',
                },
                {
                  key: 'generate',
                  label: 'Generate a new script',
                },
                {
                  key: 'create',
                  label: 'Add your own script',
                },
              ],
            }}
          />
          <Select
            native
            value={script?.key}
            defaultValue={script?.key}
            fullWidth
            required
            variant="outlined"
            onChange={(e) => {
              handleSelect(e.target.value);
            }}
          >
            <option value="">Select a Script</option>
            {options.map((op) => (
              <option value={op.key} key={op.key}>
                {op.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="mt-4 grid grid-cols-12 gap-4">
          <div className="col-span-6 text-left mt-6">
            <SecondaryButton onClick={backCallback}>Back</SecondaryButton>
          </div>
          <div className="col-span-6 text-right mt-6">
            <PrimaryButton onClick={nextCallback} disabled={!script}>
              Next
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
