const ONE_HOUR = 60 * 60 * 1000;

export const dateUsHelper = (orgDate) => {
  if (!orgDate) {
    return orgDate;
  }
  // return new Date(orgDate).toLocaleString("en-US")
  try {
    const date = new Date(orgDate);
    const pstDate = new Date(date.getTime() + 8 * ONE_HOUR);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(pstDate);
  } catch (err) {
    console.log('error', err);
    return orgDate;
  }
};

export const parseDobUS = (dob) => {
  if (dob.length === 8) {
    return `${dob.substr(0, 2)}/${dob.substr(2, 2)}/${dob.substr(4, 4)}`;
  }
  return dob;
};

export const daysTill = (date) => {
  if (!date) return '0';

  // const now = new moment();
  // const till = new moment(date);
  // const duration = moment.duration(till.diff(now));
  // return parseInt(duration.as('days'), 10);
  const now = new Date();
  const inputDate = new Date(date.replace(/-/g, '/'));

  // To calculate the time difference of two dates
  const timeDiff = inputDate.getTime() - now.getTime();

  // To calculate the no. of days between two dates
  const daysDiff = timeDiff / (1000 * 3600 * 24);
  return Math.ceil(daysDiff);
};

export const dateWithMonthName = (date) => {
  if (!date) {
    return '';
  }
  const dateObj = new Date(date.replace(/-/g, '/'));
  const month = dateObj.toLocaleString('default', { month: 'long' });
  const year = dateObj.getFullYear();
  const day = dateObj.getDate().toString();
  return `${month} ${day}, ${year}`;
  // return moment(date).format('MMMM D, YYYY');
};

export function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
