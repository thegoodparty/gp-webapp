'use client';
import { useState } from 'react';
import { dateWithTime } from 'helpers/dateHelper';
// import { Select } from '@mui/material';
// import { IoIosArrowDown } from 'react-icons/io';

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
      updatePlanCallback(version);
    }
  };
  return (
    <div>
      {/* redo this to use the dropdown instead of the select componenet (go back to the elite button) */}
      <select
        class="rounded-lg font-medium bg-slate-300 text-primary px-3 py-2 md:py-3 max-w-[100px]"
        onChange={(e) => {
          onChange(e.target.value);
        }}
      >
        <option value="">Version</option>
        {versions.map((version) => (
          <option key={version.date} value={version.text}>
            {dateWithTime(version.date)}
          </option>
        ))}
      </select>
    </div>
  );
}
