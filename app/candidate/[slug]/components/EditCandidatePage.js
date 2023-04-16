'use client';
import { useState } from 'react';
import CandidatePage from './CandidatePage';

export default function EditCandidatePage(props) {
  const [color, setColor] = useState('#734BDC');

  const childProps = {
    ...props,
    editMode: true,
    color,
    updateColorCallback: setColor,
  };

  return <CandidatePage {...childProps} />;
}
