'use client';

import { FormControl, MenuItem, Select } from '@mui/material';
import { useContext, useState } from 'react';
import { MapContext } from './MapSection';
import Search from './Search';

const partyOptions = [
  { key: 'independent', label: 'Independent' },
  { key: 'libertarian', label: 'Libertarian' },
  { key: 'green', label: 'Green Party' },
  { key: 'nonpartisan', label: 'Nonpartisan' },
];

const levelOptions = [
  { key: 'LOCAL', label: 'Local' },
  { key: 'CITY', label: 'City' },
  { key: 'COUNTY', label: 'County' },
  { key: 'STATE', label: 'State' },
  { key: 'FEDERAL', label: 'Federal' },
];

const resultsOptions = [
  // win lose or running
  { key: 'win', label: 'Win' },
  { key: 'running', label: 'Running' },
];

export default function Filters() {
  const { filters, onChangeFilters } = useContext(MapContext);

  return (
    <div className="p-4 border-b border-slate-300 md:w-[300px] lg:w-[400px] bg-white">
      <div className="relative">
        <Search />
      </div>
      <div className="grid grid-cols-12 gap-2 mt-2">
        <div className=" col-span-4">
          <Select
            native
            fullWidth
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
        <div className=" col-span-4">
          <Select
            native
            fullWidth
            value={filters.level}
            variant="outlined"
            onChange={(e) => onChangeFilters('level', e.target.value)}
            size="small"
          >
            <option value="">Level</option>
            {levelOptions.map((op) => (
              <option value={op.key} key={op.key}>
                {op.label}
              </option>
            ))}
          </Select>
        </div>
        <div className=" col-span-4">
          <Select
            native
            fullWidth
            value={filters.results}
            variant="outlined"
            onChange={(e) => onChangeFilters('results', e.target.value)}
            size="small"
          >
            <option value="">Results</option>
            {resultsOptions.map((op) => (
              <option value={op.key} key={op.key}>
                {op.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
