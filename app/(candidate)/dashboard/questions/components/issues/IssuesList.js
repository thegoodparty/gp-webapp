'use client';
import IssueItem from './IssueItem';
import { Fragment, useEffect, useState } from 'react';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import AddCustomIssue from './AddCustomIssue';
import TextField from '@shared/inputs/TextField';
import { Autocomplete } from '@mui/material';
import { getCampaign } from 'app/(candidate)/onboarding/shared/ajaxActions';
import { theme } from 'tailwind.config';

export async function saveCandidatePosition({
  description,
  campaignSlug,
  positionId,
  topIssueId,
}) {
  try {
    const api = gpApi.campaign.candidatePosition.create;
    const payload = {
      description,
      campaignSlug,
      positionId,
      topIssueId,
      // TODO: remove this once the Sails "input" value for `order` is removed or made optional
      order: 0,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at saveCandidatePosition', e);
    return false;
  }
}

async function deleteCandidatePosition(id) {
  try {
    const api = gpApi.campaign.candidatePosition.delete;
    const payload = {
      id,
    };
    return await gpFetch(api, payload);
  } catch (e) {
    console.log('error at saveCandidatePosition', e);
    return false;
  }
}

export default function IssuesList(props) {
  const { nextCallback, candidatePositions, editIssuePosition } = props;
  const [campaign, setCampaign] = useState(props.campaign);
  const [topIssues, setTopIssues] = useState(props.topIssues || []);
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(false);
  const [savedCandidatePosition, setSavedCandidatePosition] = useState(false);
  const editingCustomIssue =
    editIssuePosition && editIssuePosition.type === 'custom';

  useEffect(() => {
    setCampaign(props.campaign);
  }, [props.campaign]);

  useEffect(() => {
    console.log(`effect editIssuePosition =>`, editIssuePosition);
    if (editIssuePosition) {
      setSavedCandidatePosition(editIssuePosition);
      setSelectedIssue(editIssuePosition.topIssue);
    }
  }, [candidatePositions, editIssuePosition]);

  const selectIssueCallback = (issue) => {
    console.log(`issue =>`, issue);
    setSelectedIssue(issue);
    if (!issue) {
      setSavedCandidatePosition(false);
    }
  };

  const saveCallback = async (position, issue, candidatePosition) => {
    console.log(`candidatePositions =>`, candidatePositions);
    console.log(`{position, issue, candidatePosition} =>`, {
      position,
      issue,
      candidatePosition,
    });

    // if candidate position already exists in this order, delete it
    console.log(`editIssuePosition =>`, editIssuePosition);
    editIssuePosition && (await deleteCandidatePosition(editIssuePosition.id));

    await saveCandidatePosition({
      description: candidatePosition,
      campaignSlug: campaign.slug,
      positionId: position.id,
      topIssueId: issue.id,
    });
    nextCallback();
  };

  const handleSaveCustom = async () => {
    // if candidate position already exists in this order, delete it
    if (editIssuePosition) {
      await deleteCandidatePosition(editIssuePosition.id);
    }
    const { campaign } = await getCampaign();
    setCampaign(campaign);

    nextCallback();
  };

  const filterIssues = (value) => {
    if (value === '') {
      setTopIssues(props.topIssues);
    } else if (topIssues && typeof topIssues.filter === 'function') {
      const filtered = topIssues.filter((option) =>
        option.name.toLowerCase().includes(value.toLowerCase()),
      );
      setTopIssues(filtered);
    }
  };

  const filterOptions = (options, { inputValue }) => {
    if (options && typeof options.filter === 'function') {
      return options.filter((option) => {
        return option.name.toLowerCase().includes(inputValue.toLowerCase());
      });
    }
  };
  console.log(`selectedIssue =>`, selectedIssue);
  console.log(`editIssuePosition =>`, editIssuePosition);
  return (
    <div className=" max-w-3xl mx-auto">
      {!editingCustomIssue && !selectedIssue && (
        <div className="bg-white pt-4 pb-2">
          <Autocomplete
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
              filterIssues(newInputValue);
            }}
            className="office-autocomplete"
            sx={{
              '& fieldset': {
                border: `2px solid ${theme.extend.colors.indigo[300]}`,
                borderRadius: '8px',
              },
            }}
            options={topIssues || []}
            clearOnBlur={false}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search for climate change, economic equality…"
              />
            )}
            getOptionLabel={(option) => option.name}
            filterOptions={filterOptions}
          />
        </div>
      )}
      {!editingCustomIssue &&
        topIssues.map((topIssue) => (
          <Fragment key={topIssue.id}>
            {!selectedIssue || selectedIssue.id === topIssue.id ? (
              <IssueItem
                topIssue={topIssue}
                selectIssueCallback={selectIssueCallback}
                saveCallback={saveCallback}
                candidatePositions={candidatePositions}
                initialSaved={savedCandidatePosition}
                saveButton={Boolean(editIssuePosition)}
              />
            ) : null}
          </Fragment>
        ))}
      {(selectedIssue === 'custom' || !selectedIssue) && (
        <AddCustomIssue
          campaign={campaign}
          selectIssueCallback={selectIssueCallback}
          saveCallback={handleSaveCustom}
          editIssuePosition={editIssuePosition}
        />
      )}
    </div>
  );
}
