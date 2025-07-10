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
import AdditionalFieldsSection from 'app/admin/victory-path/[slug]/components/AdditionalFieldsSection'
import { useAdminCampaign } from '@shared/hooks/useAdminCampaign'
import { P2VProSection } from 'app/admin/victory-path/[slug]/components/P2VProSection'
import { useSnackbar } from 'helpers/useSnackbar'
import { apiRoutes } from 'gpApi/routes'
import { clientFetch } from 'gpApi/clientFetch'
import AdminDistrictPicker from './AdminDistrictPicker'

export async function sendVictoryMail(id) {
  try {
    return await clientFetch(apiRoutes.admin.campaign.victoryMail, { id })
  } catch (e) {
    console.error('error', e)
    return false
  }
}

const sections = [
  {
    title: 'Viability Score',
    fields: [
      {
        key: 'viability.level',
        label: 'Election Level',
        type: 'select',
        options: ['', 'local', 'city', 'county', 'state', 'federal'],
      },
      {
        key: 'viability.isPartisan',
        label: 'Is Partisan',
        type: 'select',
        options: ['', 'true', 'false'],
      },
      {
        key: 'viability.isIncumbent',
        label: 'Is Incumbent',
        type: 'select',
        options: ['', 'true', 'false'],
      },
      {
        key: 'viability.isUncontested',
        label: 'Is Uncontested',
        type: 'select',
        options: ['', 'true', 'false'],
      },
      { key: 'viability.candidates', label: 'Candidates', type: 'number' },
      { key: 'viability.seats', label: 'Seats', type: 'number' },
      {
        key: 'viability.candidatesPerSeat',
        label: 'Candidates Per Seat',
        type: 'number',
        formula: true,
      },
      { key: 'viability.score', label: 'Score', type: 'number', formula: true },
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

  const [state, setState] = useState({
    ...initialState,
    ...pathToVictory,
  })

  function isNumeric(str) {
    return !isNaN(str) && !isNaN(parseFloat(str))
  }

  const [notNeeded, setNotNeeded] = useState(
    pathToVictory?.p2vNotNeeded || false,
  )
  const { successSnackbar, errorSnackbar } = useSnackbar()

  useEffect(() => {
    if (!state.winNumber || !state.averageTurnoutPercent) {
      let winNumber = Math.round(state.projectedTurnout * 0.51 || 0)
      let averageTurnoutPercent = Math.round(
        (state.averageTurnout / state.totalRegisteredVoters) * 100 || 0,
      )
      setState((state) => ({
        ...state,
        winNumber,
        averageTurnoutPercent,
      }))
    }
  }, [
    state.winNumber,
    state.averageTurnoutPercent,
    state.averageTurnout,
    state.projectedTurnout,
    state.totalRegisteredVoters,
  ])

  useEffect(() => {
    if (pathToVictory?.viability) {
      for (let key in pathToVictory.viability) {
        let value = pathToVictory.viability[key]
        if (value === 'true' || value === 'false') {
          value = value === 'true'
        } else if (value !== '' && isNumeric(value)) {
          value = parseFloat(value)
        }
        pathToVictory[`viability.${key}`] = value
      }
    }
    setState((prevState) => {
      return {
        ...prevState,
        ...pathToVictory,
      }
    })
  }, [pathToVictory])

  const onChangeField = (key, value) => {
    let winNumber = Math.round(state.projectedTurnout * 0.51 || 0)
    let averageTurnoutPercent = Math.round(
      (state.averageTurnout / state.totalRegisteredVoters) * 100 || 0,
    )

    if (key === 'averageTurnout') {
      averageTurnoutPercent = Math.round(
        (value / state.totalRegisteredVoters) * 100,
      )
    }

    if (key === 'totalRegisteredVoters') {
      averageTurnoutPercent = Math.round((state.averageTurnout / value) * 100)
    }

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

    let candidatesPerSeat
    if (key === 'viability.seats' && value > 0) {
      candidatesPerSeat = Math.ceil(state['viability.candidates'] / value)
    } else if (key === 'viability.candidates' && value > 0) {
      candidatesPerSeat = Math.ceil(value / state['viability.seats'])
    } else {
      candidatesPerSeat = state['viability.candidatesPerSeat']
    }

    let voterContactGoal
    if (key === 'projectedTurnout') {
      winNumber = Math.round(value * 0.51 || 0)
      voterContactGoal = Math.round(winNumber * 5)
    }

    let score = calculateViabilityScore({
      level: key === 'viability.level' ? val : state['viability.level'],
      isPartisan:
        key === 'viability.isPartisan' ? val : state['viability.isPartisan'],
      isIncumbent:
        key === 'viability.isIncumbent' ? val : state['viability.isIncumbent'],
      isUncontested:
        key === 'viability.isUncontested'
          ? val
          : state['viability.isUncontested'],
      candidates:
        key === 'viability.candidates' && val !== ''
          ? parseInt(val)
          : state['viability.candidates'],
      candidatesPerSeat,
    })

    console.debug('saving key', key, 'value', val, 'typeof', typeof val)

    setState({
      ...state,
      [key]: val,
      winNumber,
      averageTurnoutPercent,
      voterContactGoal,
      'viability.candidatesPerSeat': candidatesPerSeat,
      'viability.score': score,
    })
  }

  const calculateViabilityScore = (viability) => {
    const {
      level,
      isPartisan,
      isIncumbent,
      isUncontested,
      candidates,
      candidatesPerSeat,
    } = viability

    let score = 0
    if (level) {
      if (level === 'city' || level === 'local') {
        score += 1
      } else if (viability.level === 'county') {
        score += 1
      } else if (viability.level === 'state') {
        score += 0.5
      }
    }

    console.log('typeof isPartisan', typeof isPartisan)
    if (typeof isPartisan === 'boolean') {
      if (isPartisan) {
        score += 0.25
      } else {
        score += 1
      }
    }

    if (typeof isIncumbent === 'boolean') {
      if (isIncumbent) {
        score += 1
      } else {
        score += 0.5
      }
    }

    if (typeof isUncontested === 'boolean') {
      if (isUncontested) {
        score += 5
        return score
      }
    }

    if (typeof candidates === 'number') {
      if (candidates > 0) {
        if (candidatesPerSeat <= 2) {
          score += 0.75
        } else if (candidatesPerSeat === 3) {
          score += 0.5
        } else if (candidatesPerSeat >= 4) {
          score += 0.25
        }
      } else {
        score += 0.25
      }
    }

    return score
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
        keysToUpdate = keys.filter((key) => state[key] != pathToVictory[key])
      } else {
        keysToUpdate = keys
      }

      let attr = keysToUpdate.map((key) => {
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
          <AdminDistrictPicker
            campaign={campaign}
            refreshCampaign={refreshCampaign}
          />
          <H4 className="my-8">
            Office: <strong>{office || 'N/A'}</strong>. State:{' '}
            <strong>{details?.state || 'N/A'}</strong>. District:{' '}
            <strong>{details?.district || 'N/A'}</strong>.{' '}
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
