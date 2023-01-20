'use client';

import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@shared/inputs/TextField';

const comparePositions = (a, b) => {
  return -a.topIssue.name.localeCompare(b.topIssue.name);
};

export default function PositionsSelector({ positions, updateCallback }) {
  const sorted = positions.sort(comparePositions);
  const [nonSelected, setNonSelected] = useState(sorted);
  const [selected, setSelected] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const addPosition = (position) => {
    const newSelected = [...selected, position];
    const newNonSelected = nonSelected.filter((item) => {
      return item.id !== position.id;
    });

    setSelected(newSelected);
    const sorted = newNonSelected.sort(comparePositions);
    setNonSelected(sorted);
    setInputValue('');
    updateCallback(newSelected);
  };

  const removePosition = (position) => {
    const newNonSelected = [...nonSelected, position];

    const newSelected = selected.filter((item) => {
      return item.id !== position.id;
    });
    const sorted = newNonSelected.sort(comparePositions);
    setNonSelected(sorted);
    setSelected(newSelected);
    updateCallback(newSelected);
  };

  return (
    <div>
      <Autocomplete
        options={nonSelected}
        groupBy={(option) => {
          return option.topIssue?.name;
        }}
        getOptionLabel={(option) => option.name}
        fullWidth
        variant="outlined"
        inputValue={inputValue}
        onInputChange={(e) => setInputValue(e?.target?.value || '')}
        renderInput={(params) => (
          <TextField {...params} label="Search all Issues" />
        )}
        renderGroup={(params) => (
          <div>
            <div className="bg-sky-200 font-bold p-2">{params.group}</div>
            <div className="p-2">{params.children}</div>
          </div>
        )}
        onChange={(event, item) => {
          addPosition(item);
        }}
      />
      <div className="mt-3">
        {selected.length > 0 && (
          <div className="text-sm font-bold">Selected issues:</div>
        )}
        {selected.map((position) => (
          <div
            className="issue inline-block bg-gray-200 rounded py-2 px-4 mt-3 mr-3 font-black cursor-pointer transition hover:bg-neutral-200"
            onClick={() => removePosition(position)}
          >
            {position.name}
          </div>
        ))}
      </div>
    </div>
  );
}
