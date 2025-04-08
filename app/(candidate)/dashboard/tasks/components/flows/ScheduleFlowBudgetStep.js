'use client'
import { InputAdornment } from '@mui/material'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import SecondaryButton from '@shared/buttons/SecondaryButton'
import Checkbox from '@shared/inputs/Checkbox'
import TextField from '@shared/inputs/TextField'
import Body1 from '@shared/typography/Body1'
import H1 from '@shared/typography/H1'
import MarketingH2 from '@shared/typography/MarketingH2'
import Overline from '@shared/typography/Overline'
import { numberFormatter } from 'helpers/numberHelper'
import { AiFillDollarCircle } from 'react-icons/ai'

export default function ScheduleFlowBudgetStep({
  value,
  voicemailValue,
  onChangeCallback,
  nextCallback,
  backCallback,
  closeCallback,
  type,
}) {
  const isTel = type === 'telemarketing'
  let price = 0.035
  if (type === 'telemarketing') {
    price = 0.04
    if (voicemailValue) {
      price = 0.055
    }
  }
  return (
    <div className="p-4 w-[80vw] max-w-xl">
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
        {isTel && (
          <div className="my-6 p-2 bg-info-background flex items-center justify-center">
            <Checkbox
              onChange={(e) => {
                onChangeCallback('voicemail', e.target.checked)
              }}
              value={voicemailValue}
              checked={!!voicemailValue}
              color="secondary"
            />
            <div>Check this box if you&apos;d like to leave voicemails. </div>
          </div>
        )}
        <div className="mt-4 grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <div className="p-4 rounded-2xl bg-neutral-background text-left ">
              <Overline className=" text-gray-600 mb-3 tracking-widest">
                AT
              </Overline>
              <MarketingH2>${price}</MarketingH2>
              <Overline className=" text-gray-600 mt-4 tracking-widest">
                PER {isTel ? 'CALL' : 'TEXT'}
              </Overline>
            </div>
          </div>
          <div className="col-span-6">
            <div className="p-4 rounded-2xl bg-neutral-background text-left overflow-auto">
              <Overline className=" text-gray-600 mb-3 tracking-widest">
                YOU CAN {isTel ? 'CALL' : 'SEND'}
              </Overline>
              <MarketingH2>{numberFormatter(value / price)}</MarketingH2>
              <Overline className=" text-gray-600 mt-4 tracking-widest">
                {isTel ? 'CONSTITUENTS' : 'TEXT MESSAGES'}
              </Overline>
            </div>
          </div>
          <div className="col-span-6 text-left mt-6">
            <SecondaryButton onClick={isTel ? closeCallback : backCallback}>
              {isTel ? 'Cancel' : 'Back'}
            </SecondaryButton>
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
  )
}
