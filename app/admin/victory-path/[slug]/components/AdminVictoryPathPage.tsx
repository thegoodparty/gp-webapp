'use client'
import PortalPanel from '@shared/layouts/PortalPanel'
import AdminWrapper from 'app/admin/shared/AdminWrapper'
import { useEffect, useState } from 'react'
import BlackButtonClient from '@shared/buttons/BlackButtonClient'
import { updateCampaign } from 'app/onboarding/shared/ajaxActions'
import RenderInputField from '@shared/inputs/RenderInputField'
import TextField from '@shared/inputs/TextField'
import { revalidatePage } from 'helpers/cacheHelper'
import H2 from '@shared/typography/H2'
import H4 from '@shared/typography/H4'
import { dateUsHelper } from 'helpers/dateHelper'
import AdditionalFieldsSection from 'app/admin/victory-path/[slug]/components/AdditionalFieldsSection'
import { useAdminCampaign } from '@shared/hooks/useAdminCampaign'
import { P2VProSection } from 'app/admin/victory-path/[slug]/components/P2VProSection'
import { useSnackbar } from 'helpers/useSnackbar'

type FormFieldKey =
  | 'canDownloadFederal'
  | 'projectedTurnout'
  | 'winNumber'
  | 'voterContactGoal'

interface FieldConfig {
  key: FormFieldKey
  label: string
  type: 'number' | 'text' | 'select'
  options?: string[]
  fullRow?: boolean
  formula?: boolean
}

interface SectionConfig {
  title: string
  fields: FieldConfig[]
}

const sections: SectionConfig[] = [
  {
    title: 'Voter File Settings',
    fields: [
      {
        key: 'canDownloadFederal',
        label: 'Can Download Federal/State Voter File',
        type: 'select',
        options: ['true', 'false'],
      },
    ],
  },
  {
    title: 'Vote Goal (read-only — sourced from live metrics)',
    fields: [
      {
        key: 'projectedTurnout',
        label: 'Projected Turnout number',
        type: 'number',
        formula: true,
      },
      { key: 'winNumber', label: 'Win Number', type: 'number', formula: true },
      {
        key: 'voterContactGoal',
        label: 'Voter Contact Goal',
        type: 'number',
        formula: true,
      },
    ],
  },
]

interface FormState {
  projectedTurnout?: number | string
  winNumber?: number | string
  voterContactGoal?: number | string
  canDownloadFederal?: boolean | string
}

interface InitialFormState {
  canDownloadFederal: string
  projectedTurnout: number
  winNumber: number
  voterContactGoal: number
}

const initialState: InitialFormState = {
  canDownloadFederal: '',
  projectedTurnout: 0,
  winNumber: 0,
  voterContactGoal: 0,
}

interface KeyTypes {
  canDownloadFederal: 'select'
  projectedTurnout: 'number'
  winNumber: 'number'
  voterContactGoal: 'number'
}

const keyTypes: KeyTypes = {
  canDownloadFederal: 'select',
  projectedTurnout: 'number',
  winNumber: 'number',
  voterContactGoal: 'number',
}

const isFormFieldKey = (key: string): key is FormFieldKey => {
  return key in keyTypes
}

interface AdminVictoryPathPageProps {
  pathname: string
  title: string
}

export default function AdminVictoryPathPage(
  props: AdminVictoryPathPageProps,
): React.JSX.Element {
  const [campaign] = useAdminCampaign()
  const { details } = campaign || {}
  const m = campaign?.raceTargetMetrics

  const [state, setState] = useState<FormState>({
    ...initialState,
    canDownloadFederal: campaign?.canDownloadFederal || false,
    projectedTurnout: m?.projectedTurnout ?? 0,
    winNumber: m?.winNumber ?? 0,
    voterContactGoal: m?.voterContactGoal ?? 0,
  })

  const { successSnackbar, errorSnackbar } = useSnackbar()

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      canDownloadFederal: campaign?.canDownloadFederal || false,
      projectedTurnout: m?.projectedTurnout ?? 0,
      winNumber: m?.winNumber ?? 0,
      voterContactGoal: m?.voterContactGoal ?? 0,
    }))
  }, [campaign?.canDownloadFederal, m])

  const onChangeField = (key: string, value: string | boolean): void => {
    if (!isFormFieldKey(key)) return
    if (key !== 'canDownloadFederal') return
    let val: string | number | boolean = value
    if (keyTypes[key] === 'select' && value !== '') {
      if (value === 'true' || value === 'false') {
        val = value === 'true'
      }
    }

    setState({
      ...state,
      [key]: val,
    })
  }

  const save = async (): Promise<void> => {
    successSnackbar('Saving...')

    try {
      const attr: {
        key: string
        value: string | number | boolean | undefined
      }[] = []
      if (state.canDownloadFederal !== campaign?.canDownloadFederal) {
        attr.push({
          key: 'canDownloadFederal',
          value: state.canDownloadFederal,
        })
      }

      if (attr.length > 0) {
        await updateCampaign(attr, campaign?.slug || '')
      }
      successSnackbar('Saved')
      await revalidatePage('/admin/victory-path/[slug]')
      window.location.reload()
    } catch (e) {
      console.log('error saving', e)
      errorSnackbar('Error saving campaign')
    }
  }

  const positionName = campaign?.positionName || null

  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <div className="mt-8">
          <H2>
            Slug: <strong>{campaign?.slug}</strong>
          </H2>
          <AdditionalFieldsSection />
          <P2VProSection />
          <H4 className="my-8">
            Office: <strong>{positionName || 'N/A'}</strong>. State:{' '}
            <strong>{details?.state || 'N/A'}</strong>. City:{' '}
            <strong>{details?.city || 'N/A'}</strong>. ElectionDate:{' '}
            <strong>{dateUsHelper(details?.electionDate) || 'N/A'}</strong>.
            Primary Election Date:{' '}
            <strong>
              {dateUsHelper(details?.primaryElectionDate) || 'N/A'}
            </strong>
          </H4>
          {sections.map((section) => (
            <div className="mb-12" key={section.title}>
              <h2 className="font-black text-2xl mb-8">{section.title}</h2>
              <div className="grid grid-cols-12 gap-4">
                {section.fields.map((field) => (
                  <div
                    className={`col-span-12 ${
                      field.fullRow ? '' : 'lg:col-span-6'
                    }`}
                    key={field.key}
                  >
                    {field.formula ? (
                      <div>
                        <TextField
                          label={field.label}
                          disabled
                          value={state[field.key]}
                        />
                      </div>
                    ) : (
                      <RenderInputField
                        field={field}
                        onChangeCallback={onChangeField}
                        value={(() => {
                          const val = state[field.key]
                          if (typeof val === 'boolean') return val
                          return String(val ?? '')
                        })()}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <BlackButtonClient onClick={save}>
              <strong>Save</strong>
            </BlackButtonClient>
          </div>
        </div>
      </PortalPanel>
    </AdminWrapper>
  )
}
