'use client';

import { FormControl, MenuItem, Select } from '@mui/material';
import { useContext, useState } from 'react';
import { MapContext } from './CandidatesPage';

const partyOptions = [
  { key: 'independent', label: 'Independent' },
  { key: 'libertarian', label: 'Libertarian' },
  { key: 'green', label: 'Green Party' },
  { key: 'nonpartisan', label: 'Nonpartisan' },
];

export default function Filters() {
  const { filters, onChangeFilters } = useContext(MapContext);

  return (
    <div className="  p-4 border-b border-slate-300">
      <Select
        native
        value={filters.party}
        variant="outlined"
        onChange={(e) => onChangeFilters('party', e.target.value)}
        size="small"
      >
        <option value="">Party</option>
        {partyOptions.map((op) => (
          <option value={op.key} key={op.key}>
            {op.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
