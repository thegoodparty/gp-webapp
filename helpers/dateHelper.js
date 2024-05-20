const ONE_HOUR = 60 * 60 * 1000;

const invalidDateFormat = (date) =>
  !date || [' ', '', 'null', 'N/A', 'n/a', 'Invalid Date'].includes(date);

const isInvalidDateObject = (date) => typeof date === 'object' && isNaN(date);

export const dateUsHelper = (orgDate) => {
  if (invalidDateFormat(orgDate)) {
    return orgDate;
  } else if (isInvalidDateObject(orgDate)) {
    return '';
  }
  try {
    const date = new Date(orgDate);
    const pstDate = new Date(date.getTime() + 8 * ONE_HOUR);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(pstDate);
  } catch (err) {
    console.log('error', err, `orgDate => ${orgDate}`);
    return '';
  }
};

export const dateWithTime = (orgDate) => {
  if (invalidDateFormat(orgDate)) {
    return orgDate;
  } else if (isInvalidDateObject(orgDate)) {
    return '';
  }
  const date = new Date(orgDate);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  return `${date.getHours()}:${
    date.getMinutes() < 10 ? '0' : ''
  }${date.getMinutes()}`;
};

export const daysTill = (date) => {
  if (invalidDateFormat(date)) {
    return '0';
  } else if (isInvalidDateObject(date)) {
    return '';
  }
  const now = new Date();
  const inputDate = new Date(date.replace(/-/g, '/'));

  // To calculate the time difference of two dates
  const timeDiff = inputDate.getTime() - now.getTime();

  // To calculate the no. of days between two dates
  const daysDiff = timeDiff / (1000 * 3600 * 24);
  return Math.ceil(daysDiff);
};

export function weeksTill(date) {
  if (invalidDateFormat(date)) {
    return false;
  } else if (isInvalidDateObject(date)) {
    return '';
  }
  const days = daysTill(date);
  const weeks = Math.floor(days / 7);
  const remainder = days - weeks * 7;
  return { weeks, days: remainder };
}

// used in the dashboard to show the week x weeks from the election date
export function weekRangeFromDate(dateStr, weeks) {
  if (invalidDateFormat(dateStr) || invalidDateFormat(dateStr) || !weeks) {
    return '';
  }
  const weekStart = new Date(dateStr);
  weekStart.setDate(weekStart.getDate() - 7 * (weeks + 1));

  const weekEnd = new Date(dateStr);
  weekEnd.setDate(weekEnd.getDate() - 7 * weeks);

  return `${dateUsHelper(weekStart)} - ${dateUsHelper(weekEnd)}`;
}
