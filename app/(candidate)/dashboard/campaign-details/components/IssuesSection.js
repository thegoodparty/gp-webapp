'use client';
import H3 from '@shared/typography/H3';
import IssuesSelector from '../../questions/components/issues/IssuesSelector';
import { useEffect, useState } from 'react';
import TextField from '@shared/inputs/TextField';
import { MdCheckBox } from 'react-icons/md';
import H4 from '@shared/typography/H4';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { getCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { useCandidatePositions } from 'app/(candidate)/dashboard/campaign-details/components/issues/useCandidatePositions';
import {
  deleteCandidatePosition,
  handleDeleteCustomIssue,
  loadCandidatePosition,
} from 'app/(candidate)/dashboard/campaign-details/components/issues/issuesUtils';
import SecondaryButton from '@shared/buttons/SecondaryButton';
import AlertDialog from '@shared/utils/AlertDialog';
import { IoAddSharp } from 'react-icons/io5';
import { useSnackbar } from 'helpers/useSnackbar';
import Button from '@shared/buttons/Button';

export default function IssuesSection(props) {
  const [campaign, setCampaign] = useState(props.campaign);
  const [candidatePositions, setCandidatePositions] = useCandidatePositions();
  const [combinedIssues, setCombinedIssues] = useState([]);
  const [editIssuePosition, setEditIssuePosition] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(null);
  const { errorSnackbar } = useSnackbar();

  useEffect(() => {
    const combined = [];
    if (Array.isArray(candidatePositions)) {
      candidatePositions?.forEach((position) => {
        combined.push({ ...position, type: 'position' });
      });
    }
    campaign?.details?.customIssues?.forEach((issue) => {
      combined.push({ ...issue, type: 'custom' });
    });
    setCombinedIssues(combined);
  }, [candidatePositions, campaign.details?.customIssues]);

  const completeCallback = async () => {
    trackEvent(EVENTS.Profile.TopIssues.SubmitEdit);
    const candidatePositions = await loadCandidatePosition(campaign.id);
    setCandidatePositions(candidatePositions);
    const campaign = await getCampaign();

    setEditIssuePosition(false);
    setCampaign(campaign);
  };

  const handleDeleteConfirmation = async () => {
    trackEvent(EVENTS.Profile.TopIssues.SubmitDelete);
    const issue = showDeleteConfirmation;
    try {
      if (issue.type === 'custom') {
        setCampaign({
          ...campaign,
          details: {
            ...campaign.details,
            customIssues: await handleDeleteCustomIssue(issue, campaign),
          },
        });
      } else if (issue.id) {
        await deleteCandidatePosition(issue.id, campaign.id);
        setCandidatePositions(
          candidatePositions.filter((position) => position.id !== issue.id),
        );
      } else {
        throw new Error('issue malformed, cannot delete.', issue);
      }
    } catch (e) {
      errorSnackbar('Could not delete issue');
    }
    setShowDeleteConfirmation(null);
  };

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
              trackEvent(EVENTS.Profile.TopIssues.ClickFinish);
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
                      <div className="ml-5">{issue.position?.name}</div>
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
                    <div className="ml-5">{issue.position}</div>
                  </div>
                )}
                <div className="flex justify-end mt-8">
                  <PrimaryButton
                    className="mr-3"
                    size="medium"
                    onClick={() => {
                      trackEvent(EVENTS.Profile.TopIssues.ClickEdit);
                      setEditIssuePosition(issue);
                    }}
                  >
                    Edit
                  </PrimaryButton>
                  <SecondaryButton
                    size="medium"
                    onClick={() => {
                      trackEvent(EVENTS.Profile.TopIssues.ClickDelete);
                      setShowDeleteConfirmation(issue);
                    }}
                  >
                    Delete
                  </SecondaryButton>
                  <AlertDialog
                    open={Boolean(showDeleteConfirmation)}
                    handleClose={() => {
                      trackEvent(EVENTS.Profile.TopIssues.CancelDelete);
                      setShowDeleteConfirmation(null);
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
  );
}
