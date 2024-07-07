'use client';
import { InputAdornment } from '@mui/material';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import TextField from '@shared/inputs/TextField';
import Body1 from '@shared/typography/Body1';
import H1 from '@shared/typography/H1';
import MarketingH2 from '@shared/typography/MarketingH2';
import Overline from '@shared/typography/Overline';
import { numberFormatter } from 'helpers/numberHelper';
import { AiFillDollarCircle } from 'react-icons/ai';

export default function ScheduleFlowStep1({
  value,
  onChangeCallback,
  nextCallback,
  closeCallback,
}) {
  return (
    <div className="p-4 w-[90vw] max-w-xl">
      <div className="text-center">
        <H1>What is your budget?</H1>
        <Body1 className="mt-4 mb-8">
          Use the calculator below to determine your budget.
        </Body1>
        <TextField
          type="number"
          value={value}
          fullWidth
          label="Budget"
          onChange={(e) => onChangeCallback('budget', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AiFillDollarCircle />
              </InputAdornment>
            ),
          }}
        />
        <div className="mt-4 grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <div className="p-4 rounded-2xl bg-neutral-background text-left ">
              <Overline className=" text-gray-600 mb-3 tracking-widest">
                AT
              </Overline>
              <MarketingH2>$0.03</MarketingH2>
              <Overline className=" text-gray-600 mt-4 tracking-widest">
                PER TEXT
              </Overline>
            </div>
          </div>
          <div className="col-span-6">
            <div className="p-4 rounded-2xl bg-neutral-background text-left overflow-auto">
              <Overline className=" text-gray-600 mb-3 tracking-widest">
                YOU CAN SEND
              </Overline>
              <MarketingH2>{numberFormatter(value / 0.03)}</MarketingH2>
              <Overline className=" text-gray-600 mt-4 tracking-widest">
                TEXT MESSAGES
              </Overline>
            </div>
          </div>
          <div className="col-span-6 text-left mt-6">
            <SecondaryButton onClick={closeCallback}>Cancel</SecondaryButton>
          </div>
          <div className="col-span-6 text-right mt-6">
            <PrimaryButton
              onClick={nextCallback}
              disabled={!value || value === 0}
            >
              Next
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
