'use client';

import { FaChevronRight } from 'react-icons/fa6';
import IssueItem from './IssueItem';
import { Fragment, useEffect, useState } from 'react';
import gpApi from 'gpApi';
import gpFetch from 'gpApi/gpFetch';
import AddCustomIssue from './AddCustomIssue';
import TextField from '@shared/inputs/TextField';
import { Autocomplete } from '@mui/material';

export async function saveCandidatePosition({
  description,
  campaignSlug,
  positionId,
  topIssueId,
  order,
}) {
  try {
    const api = gpApi.campaign.candidatePosition.create;
    const payload = {
      description,
      campaignSlug,
      positionId,
      topIssueId,
      order,
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
  const { nextCallback, candidatePositions, order, saveButton } = props;
  const [campaign, setCampaign] = useState(props.campaign);
  const [topIssues, setTopIssues] = useState(props.topIssues || []);
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState(null);

  const [selectedIssue, setSelectedIssue] = useState(false);
  const [savedCandidatePosition, setSavedCandidatePosition] = useState(false);

  useEffect(() => {
    let savedPosition = findSavedPosition(order);
    if (savedPosition) {
      setSavedCandidatePosition(savedPosition);
      setSelectedIssue(savedPosition.topIssue);
    }
  }, [order, candidatePositions]);

  const findSavedPosition = (order) => {
    let savedPosition = false;
    for (let i = 0; i < candidatePositions.length; i++) {
      if (candidatePositions[i].order === order) {
        savedPosition = candidatePositions[i];
        break;
      }
    }
    return savedPosition;
  };

  const selectIssueCallback = (issue) => {
    setSelectedIssue(issue);
    if (!issue) {
      setSavedCandidatePosition(false);
    }
  };

  const saveCallback = async (position, issue, candidatePosition) => {
    // if candidate position already exists in this order, delete it
    let savedPosition = findSavedPosition(order);
    if (savedPosition) {
      await deleteCandidatePosition(savedPosition.id);
    }

    await saveCandidatePosition({
      description: candidatePosition,
      campaignSlug: campaign.slug,
      positionId: position.id,
      topIssueId: issue.id,
      order,
    });
    nextCallback();
  };

  const handleSaveCustom = async (updatedCampaign) => {
    // if candidate position already exists in this order, delete it
    let savedPosition = findSavedPosition(order);
    if (savedPosition) {
      await deleteCandidatePosition(savedPosition.id);
    }
    setCampaign(updatedCampaign);

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

  return (
    <div className=" max-w-3xl mx-auto">
      {!selectedIssue && (
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
            options={topIssues || []}
            clearOnBlur={false}
            renderInput={(params) => (
              <TextField {...params} label="Search for Issues" />
            )}
            getOptionLabel={(option) => option.name}
            filterOptions={filterOptions}
          />
        </div>
      )}
      {topIssues.map((topIssue, index) => (
        <Fragment key={topIssue.id}>
          {!selectedIssue || selectedIssue.id === topIssue.id ? (
            <IssueItem
              topIssue={topIssue}
              selectIssueCallback={selectIssueCallback}
              saveCallback={saveCallback}
              candidatePositions={candidatePositions}
              initialSaved={savedCandidatePosition}
              saveButton={saveButton}
            />
          ) : null}
        </Fragment>
      ))}
      {(selectedIssue === 'custom' || !selectedIssue) && (
        <AddCustomIssue
          campaign={campaign}
          order={order}
          selectIssueCallback={selectIssueCallback}
          saveCallback={handleSaveCustom}
        />
      )}
    </div>
  );
}
