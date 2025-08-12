'use client'
import PortalPanel from '@shared/layouts/PortalPanel'
import AdminWrapper from 'app/admin/shared/AdminWrapper'
import { useEffect, useState, useMemo } from 'react'
import BlackButtonClient from '@shared/buttons/BlackButtonClient'
import { updateCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import RenderInputField from '@shared/inputs/RenderInputField'
import TextField from '@shared/inputs/TextField'
import { revalidatePage } from 'helpers/cacheHelper'
import H3 from '@shared/typography/H3'
import H2 from '@shared/typography/H2'
import H4 from '@shared/typography/H4'
import { dateUsHelper } from 'helpers/dateHelper'
import Checkbox from '@shared/inputs/Checkbox'
import VoterFileSection from './VoterFileSection'
import AdditionalFieldsSection from 'app/admin/victory-path/[slug]/components/AdditionalFieldsSection'
import DistrictPicker from 'app/(candidate)/onboarding/[slug]/[step]/components/districts/DistrictPicker'
import { useAdminCampaign } from '@shared/hooks/useAdminCampaign'
import { P2VProSection } from 'app/admin/victory-path/[slug]/components/P2VProSection'
import { useSnackbar } from 'helpers/useSnackbar'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'

export async function sendVictoryMail(id) {
  try {
    return await clientFetch(apiRoutes.admin.campaign.victoryMail, { id })
  } catch (e) {
    console.error('error', e)
    return false
  }
}

const updateDistrict = (slug, L2DistrictType, L2DistrictName) =>
  clientFetch(apiRoutes.campaign.district, {
    slug,
    L2DistrictType,
    L2DistrictName
  })

const sections = [
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
    title: 'Vote Goal',
    fields: [
      {
        key: 'projectedTurnout',
        label: 'Projected Turnout number',
        type: 'number',
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

const initialState = {}
const keys = []
const keyTypes = {}

sections.forEach((section) => {
  section.fields.forEach((field) => {
    keyTypes[field.key] = field.type
    if (field.initialValue) {
      initialState[field.key] = field.initialValue
    } else {
      if (field.type === 'number') {
        initialState[field.key] = 0
      } else {
        initialState[field.key] = ''
      }
    }
    keys.push(field.key)
  })
})

export default function AdminVictoryPathPage(props) {
  const [campaign, _, refreshCampaign] = useAdminCampaign()
  const { pathToVictory: p2vObject, details } = campaign
  const pathToVictory = useMemo(() => p2vObject?.data || {}, [p2vObject])
  console.log(campaign)
  console.dir(campaign, { depth: 6 })

  const [state, setState] = useState({
    ...initialState,
    ...pathToVictory,
    canDownloadFederal: campaign.canDownloadFederal,
  })

  const [notNeeded, setNotNeeded] = useState(
    pathToVictory?.p2vNotNeeded || false,
  )
  const { successSnackbar, errorSnackbar } = useSnackbar()

  // Removed local calculations for winNumber/averageTurnoutPercent – backend
  // Path-to-Victory job now provides authoritative values.

  useEffect(() => {
    setState((prevState) => {
      return {
        ...prevState,
        ...pathToVictory,
        canDownloadFederal: campaign.canDownloadFederal,
      }
    })
  }, [pathToVictory, campaign.canDownloadFederal])

  const onChangeField = (key, value) => {
    // No longer updating winNumber / averageTurnoutPercent on the client –
    // these will refresh after the backend recalculates P2V.

    let val = value
    if (keyTypes[key] === 'number' && value !== '') {
      val = parseFloat(value)
    } else if (keyTypes[key] === 'select' && value !== '') {
      if (value === 'true' || value === 'false') {
        val = value === 'true'
      }
    } else {
      val = value
    }

    // voterContactGoal now provided by backend – no local calculation.

    console.debug('saving key', key, 'value', val, 'typeof', typeof val)

    const newState = {
      ...state,
      [key]: val,
    }

    // TODO: Move recalculation of these fields to the backend if projectedTurnout is updated on a campaign
    if (key === 'projectedTurnout') {
      const pt = val === '' ? 0 : parseFloat(val)
      const winNumber = pt > 0 ? Math.floor(pt * 0.5) + 1 : 0
      const voterContactGoal = pt > 0 ? pt * 5 : 0

      newState.winNumber = winNumber
      newState.voterContactGoal = voterContactGoal
    }

    setState(newState)
  }

  const save = async () => {
    successSnackbar('Saving...')

    try {
      // only send mail the first time we update pathToVictory
      if (!pathToVictory) {
        await sendVictoryMail(campaign.id)
      }
      // send only the keys that changed
      let keysToUpdate = []
      if (pathToVictory) {
        keysToUpdate = keys.filter((key) => {
          if (key === 'canDownloadFederal') {
            return state[key] != campaign.canDownloadFederal
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

      if (state?.projectedTurnout && state.projectedTurnout > 0) {
        attr.push({ key: 'pathToVictory.p2vStatus', value: 'Complete' })
      } else {
        errorSnackbar('Projected Turnout is required')
        return
      }

      await updateCampaign(attr, campaign.slug)
      successSnackbar('Saved')
      await revalidatePage('/admin/victory-path/[slug]')
      window.location.reload()
    } catch (e) {
      console.log('error in p2v save', e)
      errorSnackbar('Error saving campaign')
    }
  }

  const office =
    details?.office === 'Other' ? `${details?.otherOffice}` : details?.office

  const handleNotNeeded = async (e) => {
    setNotNeeded(e.target.checked)

    await updateCampaign(
      [
        {
          key: 'pathToVictory.p2vNotNeeded',
          value: e.target.checked,
        },
      ],
      campaign.slug,
    )
    await refreshCampaign()
  }

  const handleDistrictSubmit = async (typeObj, nameObj) => {
    try {
      await updateDistrict(campaign.slug, typeObj.L2DistrictType, nameObj.L2DistrictName)
      await refreshCampaign()
      successSnackbar('District updated')
    } catch (e) {
      console.error('Error updating district', e)
      errorSnackbar('Error updating district')
    }
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
            Office: <strong>{office || 'N/A'}</strong>. State:{' '}
            <strong>{details?.state || 'N/A'}</strong>. City:{' '}
            <strong>{details?.city || 'N/A'}</strong>. ElectionDate:{' '}
            <strong>{dateUsHelper(details?.electionDate) || 'N/A'}</strong>.
            Primary Election Date:{' '}
            <strong>
              {dateUsHelper(details?.primaryElectionDate) || 'N/A'}
            </strong>
          </H4>
          <div className="my-12">
            <h2 className="font-black text-2xl mb-8">District Picker</h2>
            <DistrictPicker
              state={details?.state}
              electionYear={new Date(details?.electionDate).getFullYear()}
              className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-6"
              buttonText="Save District"
              onSubmit={handleDistrictSubmit}
              initialType={pathToVictory?.electionType ? { id: pathToVictory.electionType, L2DistrictType: pathToVictory.electionType, label: pathToVictory.electionType.replace(/_/g, ' ') } : null}
              initialName={pathToVictory?.electionLocation ? { id: pathToVictory.electionLocation, L2DistrictName: pathToVictory.electionLocation } : null}
            />
            {!notNeeded && <VoterFileSection />}
          </div>

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
                        value={state[field.key]}
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
