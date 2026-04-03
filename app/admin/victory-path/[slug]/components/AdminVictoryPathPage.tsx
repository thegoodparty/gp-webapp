'use client'
import PortalPanel from '@shared/layouts/PortalPanel'
import AdminWrapper from 'app/admin/shared/AdminWrapper'
import { useEffect, useState, useMemo, ChangeEvent } from 'react'
import BlackButtonClient from '@shared/buttons/BlackButtonClient'
import { updateCampaign } from 'app/onboarding/shared/ajaxActions'
import RenderInputField from '@shared/inputs/RenderInputField'
import TextField from '@shared/inputs/TextField'
import { revalidatePage } from 'helpers/cacheHelper'
import H3 from '@shared/typography/H3'
import H2 from '@shared/typography/H2'
import H4 from '@shared/typography/H4'
import { dateUsHelper } from 'helpers/dateHelper'
import Checkbox from '@shared/inputs/Checkbox'
import AdditionalFieldsSection from 'app/admin/victory-path/[slug]/components/AdditionalFieldsSection'
import { useAdminCampaign } from '@shared/hooks/useAdminCampaign'
import { P2VProSection } from 'app/admin/victory-path/[slug]/components/P2VProSection'
import { useSnackbar } from 'helpers/useSnackbar'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import type { PathToVictoryData } from 'helpers/types'

export const sendVictoryMail = async (id: number): Promise<boolean> => {
  try {
    await clientFetch(apiRoutes.admin.campaign.victoryMail, { id })
    return true
  } catch (e) {
    console.error('error', e)
    return false
  }
}

type FormFieldKey =
  | 'canDownloadFederal'
  | 'projectedTurnout'
  | 'winNumber'
  | 'voterContactGoal'
  | 'voteGoal'
  | 'voterProjection'
  | 'budgetLow'
  | 'budgetHigh'
  | 'voterMap'
  | 'finalVotes'

interface FieldConfig {
  key: FormFieldKey
  label: string
  type: 'number' | 'text' | 'select'
  options?: string[]
  fullRow?: boolean
  formula?: boolean
  initialValue?: string | number
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

  {
    title: 'Goals',
    fields: [
      { key: 'voteGoal', label: 'Vote Goal', type: 'number' },
      {
        key: 'voterProjection',
        label: 'Voter Projection - Victory Meter',
        type: 'number',
      },
    ],
  },
  {
    title: 'Budget',
    fields: [
      { key: 'budgetLow', label: 'Budget Low', type: 'number' },
      { key: 'budgetHigh', label: 'Budget High', type: 'number' },
    ],
  },
  {
    title: 'Dashboard',
    fields: [
      { key: 'voterMap', label: 'Voter Map', type: 'text', fullRow: true },
    ],
  },
  {
    title: 'Results',
    fields: [
      {
        key: 'finalVotes',
        label: 'Final Votes count (post election)',
        type: 'number',
        fullRow: true,
      },
    ],
  },
]

interface FormState {
  projectedTurnout?: number | string
  winNumber?: number | string
  voterContactGoal?: number | string
  voteGoal?: number | string
  voterProjection?: number | string
  budgetLow?: number | string
  budgetHigh?: number | string
  voterMap?: string | number
  finalVotes?: number | string
  canDownloadFederal?: boolean | string
  p2vStatus?: string
  p2vAttempts?: number
  p2vCompleteDate?: string
  completedBy?: number
  p2vNotNeeded?: boolean
  totalRegisteredVoters?: number
  republicans?: number
  democrats?: number
  indies?: number
  women?: number
  men?: number
  white?: number
  asian?: number
  africanAmerican?: number
  hispanic?: number
  averageTurnout?: number
  viability?: { score?: number; tier?: string }
  source?: string
  officeContextFingerprint?: string
}

interface InitialFormState {
  canDownloadFederal: string
  projectedTurnout: number
  winNumber: number
  voterContactGoal: number
  voteGoal: number
  voterProjection: number
  budgetLow: number
  budgetHigh: number
  voterMap: string
  finalVotes: number
}

const initialState: InitialFormState = {
  canDownloadFederal: '',
  projectedTurnout: 0,
  winNumber: 0,
  voterContactGoal: 0,
  voteGoal: 0,
  voterProjection: 0,
  budgetLow: 0,
  budgetHigh: 0,
  voterMap: '',
  finalVotes: 0,
}

interface KeyTypes {
  canDownloadFederal: 'select'
  projectedTurnout: 'number'
  winNumber: 'number'
  voterContactGoal: 'number'
  voteGoal: 'number'
  voterProjection: 'number'
  budgetLow: 'number'
  budgetHigh: 'number'
  voterMap: 'text'
  finalVotes: 'number'
}

const keys: FormFieldKey[] = [
  'canDownloadFederal',
  'voteGoal',
  'voterProjection',
  'budgetLow',
  'budgetHigh',
  'voterMap',
  'finalVotes',
]

const keyTypes: KeyTypes = {
  canDownloadFederal: 'select',
  projectedTurnout: 'number',
  winNumber: 'number',
  voterContactGoal: 'number',
  voteGoal: 'number',
  voterProjection: 'number',
  budgetLow: 'number',
  budgetHigh: 'number',
  voterMap: 'text',
  finalVotes: 'number',
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
  const [campaign, _, refreshCampaign] = useAdminCampaign()
  const { pathToVictory: p2vObject, details } = campaign || {}
  const pathToVictory = useMemo(
    () => (p2vObject?.data || {}) as PathToVictoryData,
    [p2vObject],
  )

  const [state, setState] = useState<FormState>({
    ...initialState,
    ...pathToVictory,
    canDownloadFederal: campaign?.canDownloadFederal || false,
  })

  const [notNeeded, setNotNeeded] = useState(
    Boolean(pathToVictory?.p2vNotNeeded),
  )
  const { successSnackbar, errorSnackbar } = useSnackbar()

  useEffect(() => {
    setState((prevState) => {
      return {
        ...prevState,
        ...pathToVictory,
        canDownloadFederal: campaign?.canDownloadFederal || false,
      }
    })
  }, [pathToVictory, campaign?.canDownloadFederal])

  const onChangeField = (key: string, value: string | boolean): void => {
    if (!isFormFieldKey(key)) return
    let val: string | number | boolean = value
    if (keyTypes[key] === 'number' && value !== '') {
      val = parseFloat(String(value))
    } else if (keyTypes[key] === 'select' && value !== '') {
      if (value === 'true' || value === 'false') {
        val = value === 'true'
      }
    } else {
      val = value
    }

    setState({
      ...state,
      [key]: val,
    })
  }

  const save = async (): Promise<void> => {
    successSnackbar('Saving...')

    try {
      if (!pathToVictory) {
        await sendVictoryMail(campaign?.id || 0)
      }
      let keysToUpdate: FormFieldKey[] = []
      if (pathToVictory) {
        keysToUpdate = keys.filter((key) => {
          if (key === 'canDownloadFederal') {
            return state[key] != campaign?.canDownloadFederal
          }
          return state[key] != pathToVictory[key]
        })
      } else {
        keysToUpdate = keys
      }

      let attr = keysToUpdate.map((key) => {
        if (key === 'canDownloadFederal') {
          return {
            key: key,
            value: state[key],
          }
        }
        return {
          key: `pathToVictory.${key}`,
          value: state[key],
        }
      })

      if (
        pathToVictory?.projectedTurnout &&
        Number(pathToVictory.projectedTurnout) > 0
      ) {
        attr.push({ key: 'pathToVictory.p2vStatus', value: 'Complete' })
      } else {
        errorSnackbar('Projected Turnout is required')
        return
      }

      await updateCampaign(attr, campaign?.slug || '')
      successSnackbar('Saved')
      await revalidatePage('/admin/victory-path/[slug]')
      window.location.reload()
    } catch (e) {
      console.log('error in p2v save', e)
      errorSnackbar('Error saving campaign')
    }
  }

  const positionName = campaign?.positionName || null

  const handleNotNeeded = async (
    e: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    setNotNeeded(e.target.checked)

    await updateCampaign(
      [
        {
          key: 'pathToVictory.p2vNotNeeded',
          value: e.target.checked,
        },
      ],
      campaign?.slug || '',
    )
    await refreshCampaign()
  }

  return (
    <AdminWrapper {...props}>
      <PortalPanel color="#2CCDB0">
        <div className="mt-8">
          <H2>
            Slug: <strong>{campaign?.slug}</strong>
          </H2>
          <H3 className="mt-12 mb-6 flex items-center">
            <Checkbox defaultChecked={notNeeded} onChange={handleNotNeeded} />
            <div>Mark campaign as not needing Path to Victory</div>
          </H3>{' '}
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
