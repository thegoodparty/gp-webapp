'use client';

import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@shared/inputs/TextField';
import { MdDeleteForever } from 'react-icons/md';

import styles from './PositionsSelector.module.scss';

const comparePositions = (a, b) => {
  if (!a?.topIssue) {
    return -1;
  }
  if (!b?.topIssue) {
    return 1;
  }
  return a.topIssue?.name.localeCompare(b.topIssue?.name);
};

export default function PositionsSelector({
  positions,
  updateCallback,
  square = false,
  initialSelected,
}) {
  const sorted = positions.sort(comparePositions);
  const [nonSelected, setNonSelected] = useState(sorted);
  const [selected, setSelected] = useState([]);
  const [inputValue, setInputValue] = useState('');
  useEffect(() => {
    if (initialSelected) {
      let newNonSelected = [...sorted];
      initialSelected.forEach((initialItem) => {
        newNonSelected = newNonSelected.filter((item) => {
          return item.id !== initialItem.id;
        });
      });
      setSelected(initialSelected);
      setNonSelected(newNonSelected);
    }
  }, [initialSelected, sorted]);

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
    <div className={square && styles.square}>
      <Autocomplete
        options={nonSelected}
        groupBy={(option) => {
          return option.topIssue?.name;
        }}
        getOptionLabel={(option) => option?.name}
        fullWidth
        variant="outlined"
        inputValue={inputValue}
        onInputChange={(e) => setInputValue(e?.target?.value || '')}
        renderInput={(params) => <TextField {...params} label="Add Issue" />}
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
            key={position.id}
            className="issue inline-flex items-center bg-gray-200 rounded py-2 px-4 mt-3 mr-3 font-black cursor-pointer transition hover:bg-neutral-200"
            onClick={() => removePosition(position)}
          >
            <span className="mr-2">{position?.name}</span>
            <MdDeleteForever />
          </div>
        ))}
      </div>
    </div>
  );
}
