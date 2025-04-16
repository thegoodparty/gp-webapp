'use client'
import DashboardLayout from '../shared/DashboardLayout'
import { weekRangeFromDate, weeksTill } from 'helpers/dateHelper'
import { useCallback, useEffect, useState } from 'react'
import { calculateContactGoals } from './voterGoalsHelpers'
import ElectionOver from './ElectionOver'
import EmptyState from './EmptyState'
import { updateUser } from 'helpers/userHelper'
import { useUser } from '@shared/hooks/useUser'
import PrimaryResultModal from './PrimaryResultModal'
import { fetchUserClientCampaign } from 'helpers/fetchUserClientCampaign'
import LoadingAnimation from '@shared/utils/LoadingAnimation'
import { VoterContactsProvider } from '@shared/hooks/VoterContactsProvider'
import { CampaignUpdateHistoryProvider } from '@shared/hooks/CampaignUpdateHistoryProvider'
import TasksList from '../tasks/components/TasksList'

export default function DashboardPage({ pathname, tasks }) {
  const [_, setUser] = useUser()
  const [campaign, setCampaign] = useState(null)
  const { pathToVictory: p2vObject, goals, details } = campaign || {}
  const pathToVictory = p2vObject?.data || {}
  const { primaryElectionDate } = details || {}
  const [primaryResultState, setPrimaryResultState] = useState({
    modalOpen: false,
    modalDismissed: false,
    primaryResult: undefined,
  })

  const officeName =
    details?.office?.toLowerCase() === 'other'
      ? details?.otherOffice
      : details?.office

  // TODO: we're only having to do this, because we're caching the user object in the cookie and
  //  accessing it from there, instead of the source of truth, the DB.
  //  What we should be doing is fetching the user object from the server on each route change,
  //  and then we won't have to do this.
  const updateUserCookie = async () => {
    const updated = await updateUser()
    if (updated) {
      setUser(updated)
    }
  }

  useEffect(() => {
    if (campaign) return

    loadCampaign()

    async function loadCampaign() {
      const campaign = await fetchUserClientCampaign()
      setCampaign(campaign)
      const storedPrimaryResult = campaign.details?.primaryResult

      setPrimaryResultState({
        modalOpen: false,
        modalDismissed: false,
        primaryResult: storedPrimaryResult,
      })

      updateUserCookie()
    }
  }, [])

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

  const weeksUntil = weeksTill(resolvedDate)

  const dateRange = weekRangeFromDate(resolvedDate, weeksUntil.weeks)
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

  const childProps = {
    campaign,
    pathname,
    contactGoals,
    weeksUntil,
    dateRange,
    pathToVictory,
  }

  return (
    <VoterContactsProvider>
      <CampaignUpdateHistoryProvider>
        <DashboardLayout {...childProps}>
          {campaign ? (
            <>
              <div>
                {contactGoals ? (
                  <>
                    {(weeksUntil.weeks < 0 &&
                      resolvedDate !== primaryElectionDate) ||
                    primaryResultState.primaryResult === 'lost' ? (
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
            </>
          ) : (
            <LoadingAnimation title="Loading your dashboard" fullPage={false} />
          )}
        </DashboardLayout>
      </CampaignUpdateHistoryProvider>
    </VoterContactsProvider>
  )
}
