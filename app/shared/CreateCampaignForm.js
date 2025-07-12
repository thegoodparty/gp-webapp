'use client'
import { useState } from 'react'
import { useSnackbar } from 'helpers/useSnackbar'
import PortalPanel from '@shared/layouts/PortalPanel'
import H2 from '@shared/typography/H2'
import H4 from '@shared/typography/H4'
import Body1 from './typography/Body1'
import RenderInputField from '@shared/inputs/RenderInputField'
import TextField from '@shared/inputs/TextField'
import Button from '@shared/buttons/Button'
import { CampaignOfficeSelectionModal } from 'app/(candidate)/dashboard/shared/CampaignOfficeSelectionModal'
import { getUserCookie } from 'helpers/cookieHelper'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import DistrictPicker from 'app/(candidate)/onboarding/[slug]/[step]/components/districts/DistrictPicker'

const createCampaign = async (payload) => {
  const user = getUserCookie(true)
  if (user?.email) payload.adminUserEmail = user.email
  return clientFetch(apiRoutes.admin.campaign.create, payload)
}

const updateDistrict = (slug, type, name) =>
  clientFetch(apiRoutes.campaign.district, {
    slug,
    L2DistrictType: type,
    L2DistrictName: name,
  })

const fields = [
  { key: 'firstName', label: 'First Name', type: 'text', cols: 6, required: true },
  { key: 'lastName', label: 'Last Name', type: 'text', cols: 6, required: true },
  { key: 'email', label: 'Email', type: 'email', cols: 12, required: true },
  { key: 'phone', label: 'Phone', type: 'phone', cols: 6, required: true },
  { key: 'zip', label: 'Zip Code', type: 'text', cols: 6, required: true },
  {
    key: 'party',
    label: 'Party',
    type: 'select',
    cols: 6,
    required: true,
    options: [
      'Independent',
      'Forward Party',
      'Libertarian',
      'Green Party',
      'Nonpartisan',
      'Other',
    ],
  },
]

const initialValues = fields.reduce((o, f) => ({ ...o, [f.key]: '' }), {})

export const CreateCampaignForm = () => {
  const [values, setValues] = useState(initialValues)
  const [campaign, setCampaign] = useState()
  const [officeSelected, setOfficeSelected] = useState(false)
  const [districtSaved, setDistrictSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showOffice, setShowOffice] = useState(false)
  const { successSnackbar, errorSnackbar } = useSnackbar()

  const step1Done = !!campaign
  const step2Done = officeSelected
  const step3Done = districtSaved
  const step1Disabled = step1Done
  const step2Disabled = !step1Done || step2Done
  const step3Disabled = !step2Done || step3Done

  const onChange = (k, v) => setValues({ ...values, [k]: v })

  const handleCreate = async () => {
    setLoading(true)
    const resp = await createCampaign(values)
    setLoading(false)
    if (!resp.ok) return errorSnackbar(`Creation failed: ${resp.data?.message}`)
    successSnackbar('Campaign created!')
    setCampaign(resp.data)
  }

  const handleOfficeComplete = async (updatedCampaign) => {
    setCampaign(updatedCampaign)
    setOfficeSelected(true)
    setShowOffice(false)
    successSnackbar('Office saved!')
    
  }

  const handleDistrictSave = async (type, name) => {
    try {
      await updateDistrict(
        campaign.slug,
        type.L2DistrictType,
        name.L2DistrictName,
      )
      setDistrictSaved(true)
      successSnackbar('District saved!')
    } catch (e) {
      console.error(e)
      errorSnackbar('Error saving district')
    }
  }

  return (
    <PortalPanel color="#2CCDB0">
      <H2 className="mb-12">Add a new Campaign</H2>

      <h4 className="font-bold mb-2">Step 1 – Create Campaign</h4>

      <div
        className={`grid grid-cols-12 gap-3 ${
          step1Disabled ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        {fields.map((f) => (
          <RenderInputField
            key={f.key}
            field={f}
            value={values[f.key]}
            onChangeCallback={onChange}
          />
        ))}

        {values.party === 'Other' && (
          <div className="col-span-12 md:col-span-6 mt-5">
            <TextField
              label="Other Party"
              fullWidth
              value={values.otherParty}
              onChange={(e) => onChange('otherParty', e.target.value)}
            />
          </div>
        )}
      </div>

      <Button
        color="primary"
        className="mt-4"
        loading={loading}
        disabled={
          step1Disabled ||
          (values.party === 'Other' && !values.otherParty) ||
          !fields.every((f) => values[f.key])
        }
        onClick={handleCreate}
      >
        Create Campaign
      </Button>

      {step1Done && (
        <Body1 className="mt-4 text-success">Campaign created ✔</Body1>
      )}

      <hr className="my-8" />

      <h4 className="font-bold mb-2">Step 2 – Select Office</h4>

      <Button
        color="primary"
        disabled={step2Disabled}
        onClick={() => setShowOffice(true)}
      >
        {step2Done ? 'Office Selected ✔' : 'Open Office Selector'}
      </Button>

      {campaign && (
        <CampaignOfficeSelectionModal
          adminMode
          campaign={campaign}
          show={showOffice}
          onClose={() => setShowOffice(false)}
          onSelect={handleOfficeComplete}
        />
      )}

      <hr className="my-8" />

      <h4 className="font-bold mb-4">Step 3 – Select District</h4>

      <div
        className={`max-w-4xl mx-auto grid lg:grid-cols-2 gap-6 ${
          step3Disabled ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
      {step2Done && campaign && (
        <DistrictPicker
          state={campaign?.details.state}
          electionYear={
            campaign
              ? new Date(campaign.details.electionDate).getFullYear()
              : undefined
          }
          buttonText="Save District"
          onSubmit={handleDistrictSave}
        />
      )}
      </div>

      {step3Done && (
        <H4 className="text-success mt-4">District saved ✔</H4>
      )}
    </PortalPanel>
  )
}
