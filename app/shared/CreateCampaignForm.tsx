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

interface CreateCampaignPayload extends Record<string, string | undefined> {
  firstName: string
  lastName: string
  email: string
  phone: string
  zip: string
  party: string
  otherParty?: string
  adminUserEmail?: string
}

interface CampaignResponse {
  userId: string
  id: string
  slug: string
}

const createCampaign = async (payload: CreateCampaignPayload) => {
  try {
    const user = getUserCookie()
    if (!user || !user.email) {
      console.error('User not found or missing email')
    } else {
      payload.adminUserEmail = user.email
    }

    return await clientFetch(apiRoutes.admin.campaign.create, payload)
  } catch (e) {
    console.error('error', e)
    return false
  }
}

interface FieldConfig {
  key: string
  label: string
  type: string
  cols: number
  required: boolean
  options?: string[]
}

const fields: FieldConfig[] = [
  {
    key: 'firstName',
    label: 'First Name',
    type: 'text',
    cols: 6,
    required: true,
  },
  {
    key: 'lastName',
    label: 'Last Name',
    type: 'text',
    cols: 6,
    required: true,
  },
  { key: 'email', label: 'Email', type: 'email', cols: 12, required: true },
  { key: 'phone', label: 'Phone', type: 'phone', cols: 6, required: true },
  {
    key: 'zip',
    label: 'Zip Code',
    type: 'text',
    cols: 6,
    required: true,
  },
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

interface FormValues extends Record<string, string | undefined> {
  firstName: string
  lastName: string
  email: string
  phone: string
  zip: string
  party: string
  otherParty?: string
}

export const initialValues: FormValues = fields.reduce((acc, field) => {
  acc[field.key as keyof FormValues] = ''
  return acc
}, {} as FormValues)

export const CreateCampaignForm = (): React.JSX.Element => {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [showOfficeSelectionModal, setShowOfficeSelectionModal] =
    useState(false)
  const [newCampaign, setNewCampaign] = useState<CampaignResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { successSnackbar, errorSnackbar } = useSnackbar()

  const onChangeField = (key: string, value: string | boolean) => {
    setValues({
      ...values,
      [key]: typeof value === 'boolean' ? String(value) : value,
    })
  }

  const openOfficeSelectionModal = () => {
    setShowOfficeSelectionModal(true)
  }

  const handleChooseOfficeComplete = async () => {
    successSnackbar('Office Saved! Sending set password email...')
    setShowOfficeSelectionModal(false)
    setValues(initialValues)
    setNewCampaign(null)
  }

  const disableCreate =
    Boolean(newCampaign) ||
    isLoading ||
    (values.party === 'Other' &&
      (!values.otherParty || values.otherParty === '')) ||
    !fields.every((field) => values[field.key as keyof FormValues])

  const handleCreateCampaign = async () => {
    setIsLoading(true)
    const campaignResponse = await createCampaign(values)
    if (
      campaignResponse &&
      typeof campaignResponse === 'object' &&
      'ok' in campaignResponse &&
      campaignResponse.ok
    ) {
      setNewCampaign(campaignResponse.data as CampaignResponse)
      successSnackbar('Created!')
    } else {
      const errorData =
        campaignResponse &&
        typeof campaignResponse === 'object' &&
        'data' in campaignResponse
          ? campaignResponse.data
          : null
      console.error('Campaign creation error', errorData)
      const errorMessage =
        errorData && typeof errorData === 'object' && 'message' in errorData
          ? errorData.message
          : 'Unknown error'
      errorSnackbar(`Creation failed: ${errorMessage}`)
    }
    setIsLoading(false)
  }

  return (
    <PortalPanel color="#2CCDB0">
      <H2 className="mb-12">Add a new Campaign</H2>

      <div className="grid grid-cols-12 gap-3">
        {fields.map((field) => (
          <RenderInputField
            field={field}
            value={values[field.key as keyof FormValues] || ''}
            onChangeCallback={onChangeField}
            key={field.key}
          />
        ))}
        {values.party === 'Other' && (
          <div className=" col-span-12 md:col-span-6 mt-5">
            <TextField
              label="Other Party"
              onChange={(e) => onChangeField('otherParty', e.target.value)}
              value={values.otherParty}
              fullWidth
            />
          </div>
        )}
      </div>

      <div className="my-6">
        {newCampaign ? (
          <Body1>
            <H4 className="text-success">Campaign created!</H4>
            <div className="mt-2 flex gap-2">
              <span>
                <span className="font-bold">UserId ID:</span>
                {newCampaign?.userId}
              </span>
              <span>
                <span className="font-bold">Campaign ID:</span>
                {newCampaign?.id}
              </span>
              <span>
                <span className="font-bold">Campaign Slug:</span>
                {newCampaign?.slug}
              </span>
            </div>
          </Body1>
        ) : (
          <Button
            color="primary"
            onClick={handleCreateCampaign}
            disabled={disableCreate}
            loading={isLoading}
          >
            Step 1 - Create Campaign
          </Button>
        )}
      </div>
      <hr />
      <div className="mt-6">
        <Button
          color="primary"
          onClick={openOfficeSelectionModal}
          disabled={!newCampaign}
        >
          Step 2 - Select Office
        </Button>
      </div>
      {newCampaign && (
        <CampaignOfficeSelectionModal
          campaign={{ ...newCampaign, details: {} }}
          show={showOfficeSelectionModal}
          onClose={() => setShowOfficeSelectionModal(false)}
          onSelect={handleChooseOfficeComplete}
          adminMode
        />
      )}
    </PortalPanel>
  )
}
