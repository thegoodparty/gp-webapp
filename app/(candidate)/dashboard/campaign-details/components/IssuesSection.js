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
import { useHookstate } from '@hookstate/core';
import { globalSnackbarState } from '@shared/utils/Snackbar';
import Link from 'next/link';
import { IoAddSharp } from 'react-icons/io5';

export default function IssuesSection(props) {
  const [campaign, setCampaign] = useState(props.campaign);
  const [candidatePositions, setCandidatePositions] = useCandidatePositions();
  const [combinedIssues, setCombinedIssues] = useState([]);
  const [editIssuePosition, setEditIssuePosition] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(null);
  const snackbarState = useHookstate(globalSnackbarState);

  useEffect(() => {
    const combined = [];
    candidatePositions?.forEach((position) => {
      combined.push({ ...position, type: 'position' });
    });
    campaign?.details?.customIssues?.forEach((issue) => {
      combined.push({ ...issue, type: 'custom' });
    });
    setCombinedIssues(combined);
  }, [candidatePositions, campaign.details?.customIssues]);

  const completeCallback = async () => {
    const res = await loadCandidatePosition(props.campaign.slug);
    setCandidatePositions(res.candidatePositions);
    const res2 = await getCampaign();

    setEditIssuePosition(false);
    setCampaign(res2.campaign);
  };

  const handleDeleteConfirmation = async () => {
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
        await deleteCandidatePosition(issue.id);
        setCandidatePositions(
          candidatePositions.filter((position) => position.id !== issue.id),
        );
      } else {
        throw new Error('issue malformed, cannot delete.', issue);
      }
    } catch (e) {
      snackbarState.set({
        isOpen: true,
        message: 'Could not delete issue',
        isError: true,
      });
    }
    setShowDeleteConfirmation(null);
  };

  return (
    <section className="border-t pt-6 border-gray-600">
      <H3 className="flex justify-between items-center">
        <span>Your Top Issues</span>
        {(!combinedIssues?.length || combinedIssues?.length < 3) && (
          <Link href="/dashboard/questions?generate=all">
            <PrimaryButton className="inline-flex align-center" size="medium">
              Finish Entering Issues
              <IoAddSharp className="ml-1 inline text-2xl" />
            </PrimaryButton>
          </Link>
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
                    <div className="opacity-40 p-4 flex mb-4">
                      <MdCheckBox className="mt-1 mr-2" />
                      {issue.position?.name}
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
                  <div className="opacity-40 p-4 flex">
                    <MdCheckBox className="mt-1 mr-2" />
                    <div>{issue.position}</div>
                  </div>
                )}
                <div className="flex justify-end mt-8">
                  <PrimaryButton
                    className="mr-3"
                    size="medium"
                    onClick={() => {
                      setEditIssuePosition(issue);
                    }}
                  >
                    Edit
                  </PrimaryButton>
                  <SecondaryButton
                    size="medium"
                    onClick={() => setShowDeleteConfirmation(issue)}
                  >
                    Delete
                  </SecondaryButton>
                  <AlertDialog
                    open={Boolean(showDeleteConfirmation)}
                    handleClose={() => {
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
