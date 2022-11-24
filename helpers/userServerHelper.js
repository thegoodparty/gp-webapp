import cookies from 'next/headers';

export const getServerToken = () => {
    const nextCookies = cookies();
    return nextCookies.get('token').value;
}
  
export const getServerUser = () => {
    const { cookies } = require('next/headers');
    const nextCookies = cookies();
    return JSON.parse(nextCookies.get('user').value);
}