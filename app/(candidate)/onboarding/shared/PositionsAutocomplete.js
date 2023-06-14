'use client';

import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@shared/inputs/TextField';
import { MdDeleteForever } from 'react-icons/md';

import styles from './PositionsSelector.module.scss';
import H5 from '@shared/typography/H5';
import { Paper } from '@mui/material';
import { RiSearch2Line } from 'react-icons/ri';

const comparePositions = (a, b) => {
  if (!a?.topIssue) {
    return -1;
  }
  if (!b?.topIssue) {
    return 1;
  }
  return a.topIssue?.name.localeCompare(b.topIssue?.name);
};

export default function PositionsAutocomplete({
  positions,
  updateCallback,
  initialSelected,
}) {
  const sorted = positions.sort(comparePositions);
  const [inputValue, setInputValue] = useState('');
  useEffect(() => {
    // if (initialSelected) {
    //   let newNonSelected = [...sorted];
    //   initialSelected.forEach((initialItem) => {
    //     newNonSelected = newNonSelected.filter((item) => {
    //       return item.id !== initialItem.id;
    //     });
    //   });
    //   setSelected(initialSelected);
    //   setNonSelected(newNonSelected);
    // }
  }, [initialSelected, sorted]);

  const addPosition = (position) => {
    updateCallback(position);
  };

  return (
    <div className={styles.square}>
      <Autocomplete
        options={sorted}
        groupBy={(option) => {
          return option.topIssue?.name;
        }}
        getOptionLabel={(option) => option?.name}
        fullWidth
        variant="outlined"
        PaperComponent={({ children }) => (
          <Paper style={{ background: '#13161A' }}>{children}</Paper>
        )}
        popupIcon={<RiSearch2Line className="mr-2" />}
        inputValue={inputValue}
        onInputChange={(e) => setInputValue(e?.target?.value || '')}
        renderInput={(params) => <TextField {...params} label="Add Issue" />}
        renderGroup={(params) => (
          <div>
            <div className="bg-primary p-2">
              <H5 className="text-indigo-300">{params.group}</H5>
            </div>
            <div className="bg-primary p-2 text-gray-800">
              {params.children}
            </div>
          </div>
        )}
        onChange={(event, item) => {
          addPosition(item);
        }}
      />
      {/* <div className="mt-3">
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
      </div> */}
    </div>
  );
}
