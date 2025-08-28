'use client'
import DashboardLayout from '../shared/DashboardLayout'
import { weeksTill } from 'helpers/dateHelper'
import { useCallback, useEffect, useState } from 'react'
import { calculateContactGoals } from './voterGoalsHelpers'
import ElectionOver from './ElectionOver'
import EmptyState from './EmptyState'
import { updateUser } from 'helpers/userHelper'
import { useUser } from '@shared/hooks/useUser'
import PrimaryResultModal from './PrimaryResultModal'
import GeneralResultModal from './GeneralResultModal'
import LoadingAnimation from '@shared/utils/LoadingAnimation'
import { VoterContactsProvider } from '@shared/hooks/VoterContactsProvider'
import { CampaignUpdateHistoryProvider } from '@shared/hooks/CampaignUpdateHistoryProvider'
import TasksList from './tasks/TasksList'
import { EVENTS, trackEvent } from 'helpers/analyticsHelper'

export default function DashboardPage({
  pathname,
  tasks,
  campaign: campaignProp,
}) {
  const [_, setUser] = useUser()
  const [campaign, setCampaign] = useState(campaignProp)
  const { pathToVictory: p2vObject, goals, details } = campaign || {}
  const pathToVictory = p2vObject?.data || {}
  const { primaryElectionDate } = details || {}
  const [primaryResultState, setPrimaryResultState] = useState({
    modalOpen: false,
    modalDismissed: false,
    primaryResult: campaignProp.details?.primaryResult,
  })

  const officeName =
    details?.office?.toLowerCase() === 'other'
      ? details?.otherOffice
      : details?.office

  useEffect(() => {
    updateUserCookie()

    // TODO: we're only having to do this, because we're caching the user object in the cookie and
    //  accessing it from there, instead of the source of truth, the DB.
    //  What we should be doing is fetching the user object from the server on each route change,
    //  and then we won't have to do this.
    async function updateUserCookie() {
      const updated = await updateUser()
      if (updated) {
        setUser(updated)
      }
    }
  }, [setUser])

  const electionDate = details?.electionDate || goals?.electionDate
  const { voterContactGoal, voteGoal } = pathToVictory || {}
  let resolvedContactGoal = voterContactGoal ?? voteGoal * 5
  const now = new Date()
  let resolvedDate = electionDate

  if (primaryElectionDate) {
    const primaryElectionDateObj = new Date(primaryElectionDate)
    const { modalOpen, primaryResult, modalDismissed } = primaryResultState

    if (primaryElectionDateObj > now) {
      resolvedDate = primaryElectionDate
    } else if (!primaryResult && !modalOpen && !modalDismissed) {
      // Primary date has passed, open up results modal
      setPrimaryResultState((state) => ({
        ...state,
        modalOpen: true,
      }))
    }
  }

  const [generalModalOpen, setGeneralModalOpen] = useState(false)

  useEffect(() => {
    const shouldOpen =
      !primaryElectionDate &&
      typeof details?.wonGeneral !== 'boolean' &&
      weeksTill(electionDate).weeks < 0

    setGeneralModalOpen(!!shouldOpen)
  }, [primaryElectionDate, details?.wonGeneral, electionDate])

  const weeksUntil = weeksTill(resolvedDate)
  const contactGoals = calculateContactGoals(resolvedContactGoal)

  const primaryResultCloseCallback = useCallback((selectedResult) => {
    if (selectedResult) {
      // user selected their primary election result
      setPrimaryResultState((state) => ({
        ...state,
        modalOpen: false,
        primaryResult: selectedResult,
      }))

      //update local campaign object
      setCampaign((campaign) => ({
        ...campaign,
        details: {
          ...campaign.details,
          primaryResult: selectedResult,
        },
      }))
    } else {
      // user pressed Cancel to dismiss modal for now
      setPrimaryResultState({
        modalOpen: false,
        modalDismissed: true,
        primaryResult: undefined,
      })
    }
  }, [])

  const generalResultCloseCallback = useCallback((result) => {
    setGeneralModalOpen(false)
    if (typeof result === 'boolean') {
      setCampaign((campaign) => ({
        ...campaign,
        details: {
          ...campaign.details,
          wonGeneral: result,
        },
      }))
    }
  }, [])

  trackEvent(EVENTS.Dashboard.Viewed, {
    p2vCompleted: `${
      pathToVictory && pathToVictory?.p2vStatus === 'Complete'
        ? 'true'
        : 'false'
    }`,
  })

  const electionInPast =
    weeksUntil.weeks < 0 && resolvedDate !== primaryElectionDate
  const primaryLost = primaryResultState.primaryResult === 'lost'

  if (electionInPast || primaryLost) {
    //for usersnap to pick up if this issue persists. https://goodparty.atlassian.net/browse/WEB-3915
    console.log(
      `displaying election over - electionInPast: ${electionInPast}, primaryLost: ${primaryLost}, resolvedDate: ${resolvedDate}, weeksUntil: ${JSON.stringify(
        weeksUntil,
      )}, primaryElectionDate: ${primaryElectionDate}, electionDate: ${electionDate}, primaryResult: ${
        primaryResultState.primaryResult
      }, now: ${now.toISOString()}`,
    )
  }

  return (
    <VoterContactsProvider>
      <CampaignUpdateHistoryProvider>
        <DashboardLayout pathname={pathname} campaign={campaign}>
          {campaign ? (
            <>
              <div>
                {contactGoals ? (
                  <>
                    {electionInPast || primaryLost ? (
                      <ElectionOver />
                    ) : (
                      <TasksList campaign={campaign} tasks={tasks} />
                    )}
                  </>
                ) : (
                  <EmptyState campaign={campaign} />
                )}
              </div>
              {primaryElectionDate && (
                <PrimaryResultModal
                  open={primaryResultState.modalOpen}
                  onClose={primaryResultCloseCallback}
                  electionDate={electionDate}
                  officeName={officeName}
                />
              )}
              {!primaryElectionDate && generalModalOpen && (
                <GeneralResultModal
                  open={generalModalOpen}
                  onClose={generalResultCloseCallback}
                  electionDate={electionDate}
                  officeName={officeName}
                />
              )}
            </>
          ) : (
            <LoadingAnimation title="Loading your dashboard" fullPage={false} />
          )}
        </DashboardLayout>
      </CampaignUpdateHistoryProvider>
    </VoterContactsProvider>
  )
}
