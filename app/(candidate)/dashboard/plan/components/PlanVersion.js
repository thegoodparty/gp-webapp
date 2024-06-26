'use client';
import { useState } from 'react';
import { Select } from '@mui/material';
import { dateWithTime } from 'helpers/dateHelper';

export default function PlanVersion({
  versions,
  updatePlanCallback,
  latestVersion,
}) {
  const [state, setState] = useState('');
  if (!versions) {
    return null;
  }
  const onChange = (version) => {
    setState(version);
    if (version === '') {
      updatePlanCallback(latestVersion);
    } else {
      updatePlanCallback({ content: version });
    }
  };
  return (
    <div className="text-right p-2 hidden-for-print">
      <Select
        native
        value={state}
        required
        variant="outlined"
        onChange={(e) => {
          onChange(e.target.value);
        }}
      >
        <option value="">Latest Version</option>
        {versions.map((version) => (
          <option key={version.date} value={version.text}>
            {dateWithTime(version.date)}
          </option>
        ))}
      </Select>
    </div>
  );
}
