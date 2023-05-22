'use client';

import { cloneElement, Fragment, useState } from 'react';
import AccordionSummary from './AccordionSummary';

export default function Accordion({ summaries = [], panels = [] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="">
      {summaries.map((summary, index, openPanel) => (
        <Fragment key={summary.label}>
          <AccordionSummary
            {...summary}
            open={index === open}
            toggleCallback={() => {
              setOpen(index);
            }}
          />
          {open === index && (
            <div className="bg-slate-200 py-4 px-7 rounded-b-xl">
              {panels[open]}
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
