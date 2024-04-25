'use client';

import H3 from '@shared/typography/H3';

import IssuesSelector from '../../questions/components/issues/IssuesSelector';
import { loadCandidatePosition } from '../../questions/components/QuestionsPage';
import { useEffect, useState } from 'react';
import TextField from '@shared/inputs/TextField';
import { MdCheckBox } from 'react-icons/md';
import H4 from '@shared/typography/H4';
import PrimaryButton from '@shared/buttons/PrimaryButton';
import { getCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';

export default function IssuesSection(props) {
  const [campaign, setCampaign] = useState(props.campaign);
  const [candidatePositions, setCandidatePositions] = useState(
    props.candidatePositions,
  );
  const [combinedIssues, setCombinedIssues] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [startTab, setStartTab] = useState(0);
  useEffect(() => {
    const sortedIssues = [];
    candidatePositions?.forEach((position) => {
      sortedIssues.push({ ...position, type: 'position' });
    });
    campaign?.details?.customIssues?.forEach((issue) => {
      sortedIssues.push({ ...issue, type: 'custom' });
    });
    sortedIssues.sort((a, b) => a.order - b.order);
    setCombinedIssues(sortedIssues);
  }, [candidatePositions, campaign.details?.customIssues]);

  const completeCallback = async () => {
    const res = await loadCandidatePosition(props.campaign.slug);
    setCandidatePositions(res.candidatePositions);
    const res2 = await getCampaign();

    setEditMode(false);
    setCampaign(res2.campaign);
  };

  const setEdit = (index) => {
    setEditMode(true);
    setStartTab(index);
  };

  return (
    <section className="border-t pt-6 border-gray-600">
      <H3>Your Top Issues</H3>
      {editMode ? (
        <IssuesSelector
          {...props}
          standaloneMode
          completeCallback={completeCallback}
          candidatePositions={candidatePositions}
          updatePositionsCallback={completeCallback}
          startTab={startTab}
        />
      ) : (
        <>
          {combinedIssues.map((issue, index) => (
            <div key={issue.id || index} className="mt-8">
              <H4>Issue {index + 1}</H4>
              <div className=" opacity-50 border border-primary rounded-lg p-8  mt-1">
                <TextField
                  fullWidth
                  value={issue.title || issue.topIssue?.name}
                  label="Issue"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <div className="">
                  <div className="">
                    {issue.type === 'position' ? (
                      <>
                        <div className="p-4 flex mb-4">
                          <MdCheckBox className="mt-1 mr-2" />
                          {issue.position?.name}
                        </div>
                        <TextField
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
                      <div className="p-4 flex">
                        <MdCheckBox className="mt-1 mr-2" />
                        <div>{issue.position}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end mt-8">
                  <div
                    onClick={() => {
                      setEdit(index);
                    }}
                  >
                    <PrimaryButton size="medium">Edit</PrimaryButton>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </section>
  );
}
