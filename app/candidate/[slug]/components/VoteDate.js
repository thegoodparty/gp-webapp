/**
 *
 * VoteDate
 *
 */

import React from 'react';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { BiMinusCircle } from 'react-icons/bi';

import { dateWithMonthName } from '/helpers/dateHelper';

function VoteDate({ date, title, showPast }) {
  if (!date) {
    return <></>;
  }

  const datePassed = new Date(date) - new Date() > 0;
  if (showPast && !datePassed) {
    return <></>;
  }
  if (!showPast && datePassed) {
    return <></>;
  }

  return (
    <div className="pt-6 flex" style={datePassed ? { color: '#919191' } : {}}>
      <div className="mr-3 text-4xl">
        {datePassed ? (
          <BiMinusCircle style={{ color: '#919191' }} />
        ) : (
          <IoMdCheckmarkCircle />
        )}
      </div>
      <div>
        <div>
          <strong>{title}</strong>
        </div>
        <div className="text-sm mt-2 font-bold text-stone-500">
          {dateWithMonthName(date)}
        </div>
      </div>
    </div>
  );
}

export default VoteDate;
