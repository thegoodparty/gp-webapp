'use client'
import H3 from '@shared/typography/H3'
import IssuesSelector from '../../questions/components/issues/IssuesSelector'
import { useEffect, useState } from 'react'
import TextField from '@shared/inputs/TextField'
import { MdCheckBox } from 'react-icons/md'
import H4 from '@shared/typography/H4'
import PrimaryButton from '@shared/buttons/PrimaryButton'
import { getCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions'
import { useCandidatePositions } from 'app/(candidate)/dashboard/campaign-details/components/issues/useCandidatePositions'
import {
  deleteCandidatePosition,
  handleDeleteCustomIssue,
  loadCandidatePosition,
} from 'app/(candidate)/dashboard/campaign-details/components/issues/issuesUtils'
import SecondaryButton from '@shared/buttons/SecondaryButton'
import AlertDialog from '@shared/utils/AlertDialog'
import { IoAddSharp } from 'react-icons/io5'
import { useSnackbar } from 'helpers/useSnackbar'
import Button from '@shared/buttons/Button'
import { trackEvent, EVENTS } from 'helpers/analyticsHelper'
import { Campaign, CustomIssue, CandidatePosition } from 'helpers/types'
import { EditIssuePosition } from 'app/(candidate)/dashboard/questions/components/issues/IssuesList'

interface IssuesSectionProps {
  campaign?: Campaign
}

const IssuesSection = (props: IssuesSectionProps): React.JSX.Element => {
  const [campaign, setCampaign] = useState<Campaign | undefined>(props.campaign)
  const [candidatePositions, setCandidatePositions] = useCandidatePositions()
  const [combinedIssues, setCombinedIssues] = useState<EditIssuePosition[]>([])
  const [editIssuePosition, setEditIssuePosition] = useState<
    EditIssuePosition | false | null
  >(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<EditIssuePosition | null>(null)
  const { errorSnackbar } = useSnackbar()

  useEffect(() => {
    const combined: EditIssuePosition[] = []
    if (Array.isArray(candidatePositions)) {
      candidatePositions?.forEach((position: CandidatePosition) => {
        const { id, topIssue, position: issuePosition, description } = position
        combined.push({
          id,
          topIssue,
          position: issuePosition,
          description,
          type: 'position',
        })
      })
    }
    campaign?.details?.customIssues?.forEach((issue: CustomIssue) => {
      const { title, position } = issue
      combined.push({
        title,
        position,
        type: 'custom',
      })
    })
    setCombinedIssues(combined)
  }, [candidatePositions, campaign?.details?.customIssues])

  const completeCallback = async () => {
    trackEvent(EVENTS.Profile.TopIssues.SubmitEdit)
    if (campaign?.id) {
      const loadedPositions = await loadCandidatePosition(campaign.id)
      if (Array.isArray(loadedPositions)) {
        setCandidatePositions(loadedPositions)
      }
    }
    const updatedCampaign = await getCampaign()

    setEditIssuePosition(false)
    if (updatedCampaign) {
      setCampaign(updatedCampaign)
    }
  }

  const handleDeleteConfirmation = async () => {
    trackEvent(EVENTS.Profile.TopIssues.SubmitDelete)
    const issue = showDeleteConfirmation
    if (!issue) return
    try {
      if (issue.type === 'custom') {
        if (campaign && issue.title && typeof issue.position === 'string') {
          const customIssueToDelete: CustomIssue = {
            title: issue.title,
            position: issue.position,
          }
          setCampaign({
            ...campaign,
            details: {
              ...campaign.details,
              customIssues: await handleDeleteCustomIssue(
                customIssueToDelete,
                campaign,
              ),
            },
          })
        }
      } else if (issue.id && campaign?.id) {
        await deleteCandidatePosition(Number(issue.id), campaign.id)
        const filteredPositions = (candidatePositions || []).filter(
          (position: CandidatePosition) => position.id !== issue.id,
        )
        setCandidatePositions(filteredPositions)
      } else {
        throw new Error('issue malformed, cannot delete.')
      }
    } catch (e) {
      errorSnackbar('Could not delete issue')
    }
    setShowDeleteConfirmation(null)
  }

  return (
    <section className="border-t pt-6 border-gray-600">
      <H3 className="flex justify-between items-center">
        <span>Your Top Issues</span>
        {(!combinedIssues?.length || combinedIssues?.length < 3) && (
          <Button
            size="large"
            href="/dashboard/questions?generate=all"
            className="inline-flex align-center !py-2"
            onClick={() => {
              trackEvent(EVENTS.Profile.TopIssues.ClickFinish)
            }}
          >
            Finish Entering Issues
            <IoAddSharp className="ml-1 inline text-2xl" />
          </Button>
        )}
      </H3>
      {editIssuePosition ? (
        <IssuesSelector
          {...props}
          campaign={campaign!}
          completeCallback={completeCallback}
          candidatePositions={candidatePositions}
          updatePositionsCallback={completeCallback}
          editIssuePosition={editIssuePosition}
          setEditIssuePosition={setEditIssuePosition}
        />
      ) : (
        <>
          {combinedIssues.map((issue, index) => (
            <div key={issue.id || index} className="mt-8">
              <H4>Issue {index + 1}</H4>
              <div className="border border-primary rounded-lg p-8  mt-1">
                <TextField
                  disabled
                  fullWidth
                  value={issue.title || issue.topIssue?.name}
                  label="Issue"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                {issue.type === 'position' ? (
                  <>
                    <div className="opacity-40 p-4 mb-4">
                      <MdCheckBox className="float-left mt-[2px] w-4 h-4" />
                      <div className="ml-5">
                        {typeof issue.position === 'object'
                          ? issue.position?.name
                          : issue.position}
                      </div>
                    </div>
                    <TextField
                      disabled
                      fullWidth
                      value={issue.description}
                      label="Position"
                      multiline
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </>
                ) : (
                  <div className="opacity-40 p-4">
                    <MdCheckBox className="float-left mt-[2px] w-4 h-4" />
                    <div className="ml-5">
                      {typeof issue.position === 'string'
                        ? issue.position
                        : issue.position?.name}
                    </div>
                  </div>
                )}
                <div className="flex justify-end mt-8">
                  <PrimaryButton
                    className="mr-3"
                    size="medium"
                    onClick={() => {
                      trackEvent(EVENTS.Profile.TopIssues.ClickEdit)
                      setEditIssuePosition(issue)
                    }}
                  >
                    Edit
                  </PrimaryButton>
                  <SecondaryButton
                    size="medium"
                    onClick={() => {
                      trackEvent(EVENTS.Profile.TopIssues.ClickDelete)
                      setShowDeleteConfirmation(issue)
                    }}
                  >
                    Delete
                  </SecondaryButton>
                  <AlertDialog
                    open={Boolean(showDeleteConfirmation)}
                    handleClose={() => {
                      trackEvent(EVENTS.Profile.TopIssues.CancelDelete)
                      setShowDeleteConfirmation(null)
                    }}
                    title="Delete Issue"
                    description="Are you sure you want to delete this Issue?"
                    handleProceed={handleDeleteConfirmation}
                  />
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </section>
  )
}

export default IssuesSection
