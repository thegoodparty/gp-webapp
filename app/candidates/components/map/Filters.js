'use client';

import { FormControl, MenuItem, Select } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { MapContext } from './MapSection';
import Checkbox from '@shared/inputs/Checkbox';
import TextField from '@shared/inputs/TextField';
// import Search from './Search';

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
  const { filters, onChangeFilters, campaigns } = useContext(MapContext);
  const [officeOptions, setOfficeOptions] = useState([]);
  useEffect(() => {
    if (!campaigns || campaigns.length === 0) {
      return;
    }
    const allOffices = campaigns.map((campaign) => campaign.office);
    const offices = [...new Set(allOffices)]; // dedupe
    setOfficeOptions(offices);
  }, [campaigns]);

  return (
    <div className="md:w-[400px] lg:w-[500px] bg-white">
      <div className="p-4">
        {/* <div className="relative">
        <Search />
      </div> */}
        <div className="grid grid-cols-12 gap-2">
          <div className=" col-span-4">
            <Select
              native
              fullWidth
              value={filters.party}
              variant="outlined"
              onChange={(e) => onChangeFilters('party', e.target.value)}
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
              value={filters.offices}
              variant="outlined"
              onChange={(e) => onChangeFilters('office', e.target.value)}
            >
              <option value="">Office</option>
              {officeOptions.map((op) => (
                <option value={op} key={op}>
                  {op}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="flex mt-4 items-center justify-center">
          <Checkbox
            label="Show Winners Only"
            checked={filters.win}
            onChange={(e) => onChangeFilters('results', e.target.checked)}
          />{' '}
          Show Winners Only
        </div>
      </div>
      <div className="bg-indigo-100 p-4">
        <TextField
          label="Search for a candidate"
          fullWidth
          value={filters.name}
          onChange={(e) => onChangeFilters('name', e.target.value)}
          className="bg-white"
        />
      </div>
    </div>
  );
}
