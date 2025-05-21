'use client'
import Button from '@shared/buttons/Button'
import Body1 from '@shared/typography/Body1'
import H2 from '@shared/typography/H2'
import Paper from '@shared/utils/Paper'
import {
  EIN_PATTERN_FULL,
  EinCheckInput,
} from 'app/(candidate)/dashboard/pro-sign-up/committee-check/components/EinCheckInput'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { StyledAlert } from '@shared/alerts/StyledAlert'
import { BiLinkExternal } from 'react-icons/bi'
import Body2 from '@shared/typography/Body2'
import TextField from '@shared/inputs/TextField'
import { useComplianceForm } from './ComplianceFormContext'

export default function EINStep() {
  const router = useRouter()
  const [complianceForm, setComplianceForm] = useComplianceForm()

  const einNumber = complianceForm?.ein
  const einName = complianceForm?.name
  const einAddress = complianceForm?.address

  const [validatedEin, setValidatedEin] = useState(
    EIN_PATTERN_FULL.test(einNumber) || null,
  )

  useEffect(() => {
    // TODO: is this redundant?
    einNumber && setValidatedEin(EIN_PATTERN_FULL.test(einNumber) || null)
  }, [einNumber])

  const handleEinChange = (value) => {
    setComplianceForm((current) => ({
      ...current,
      ein: value,
    }))
    setValidatedEin(EIN_PATTERN_FULL.test(value) || null)
  }

  const handleAddressChange = (value) => {
    setComplianceForm((current) => ({
      ...current,
      address: value,
    }))
  }

  const handleNameChange = (value) => {
    setComplianceForm((current) => ({
      ...current,
      name: value,
    }))
  }

  const handleNext = async () => {
    router.push('/dashboard/text-messaging/p2p-setup/website')
  }

  const canSubmit =
    einNumber && einNumber.length === 10 && einName && einAddress

  return (
    <>
      <Paper className="mt-8 max-w-4xl mx-auto">
        <H2>EIN - Employer Identification Number</H2>
        <Body1 className="mb-8 mt-2">
          An EIN is required to register a political brand with The Campaign
          Registry (TCR).
          <br />
          All political entities must have a valid EIN to initiate the
          compliance process.
        </Body1>
        <div className="max-w-xl">
          <EinCheckInput
            value={einNumber}
            onChange={handleEinChange}
            validated={validatedEin}
            setValidated={setValidatedEin}
          />
          <div className="mt-4">
            <TextField
              label="Name (Should be the same as the EIN name)"
              value={einName}
              onChange={(e) => handleNameChange(e.target.value)}
              fullWidth
              required
              name="Name"
            />
          </div>
          <div className="mt-6">
            <TextField
              label="Address (Should be the same as the EIN address)"
              value={einAddress}
              onChange={(e) => handleAddressChange(e.target.value)}
              fullWidth
              required
              name="Address"
            />
          </div>
          <StyledAlert severity="info" className="flex items-center my-4">
            <div className="flex items-center justify-between pr-4">
              <Body2>Don&apos;t have an EIN? Apply for one today.</Body2>
              <a
                href="https://www.irs.gov/businesses/small-businesses-self-employed/get-an-employer-identification-number"
                target="_blank"
                rel="noreferrer"
                className="underline flex items-center gap-2"
              >
                <Body2>Apply for an EIN</Body2>
                <BiLinkExternal />
              </a>
            </div>
          </StyledAlert>
        </div>
        <div className="mt-8 flex justify-between">
          <Link href="/dashboard/text-messaging">
            <Button color="neutral" className="mr-4">
              Exit
            </Button>
          </Link>
          <Button onClick={handleNext} disabled={!canSubmit} color="secondary">
            Next
          </Button>
        </div>
      </Paper>
    </>
  )
}
