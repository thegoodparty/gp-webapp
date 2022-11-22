export const getInitials = (user) => {
  if (!user) {
    return '';
  }
  const { name } = user;
  if (!name) {
    return name;
  }
  console.log('name', name);
  const initialsArr = name.split(' ');
  return `${initialsArr[0].charAt(0)}${
    initialsArr.length > 1 ? initialsArr[initialsArr.length - 1].charAt(0) : ''
  }`;
};

export const getServerToken = () => {
  const { cookies } = require('next/headers');
  const nextCookies = cookies();
  return nextCookies.get('token').value;
}

export const getServerUser = () => {
  const { cookies } = require('next/headers');
  const nextCookies = cookies();
  return JSON.parse(nextCookies.get('user').value);
}