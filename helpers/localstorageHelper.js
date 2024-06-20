let canUseLocalStorage = true;
if (typeof Storage === 'undefined') {
  canUseLocalStorage = false;
}

export const getItem = (key, withParse = true) => {
  if (!canUseLocalStorage) {
    return;
  }
  const item = window.localStorage.getItem(key);
  if (!item) {
    return false;
  }
  if (withParse) {
    return JSON.parse(item);
  }
  return item;
};

export const setItem = (key, value) => {
  if (!canUseLocalStorage) {
    return;
  }
  let item = value;
  if (typeof item !== 'string') {
    item = JSON.stringify(item);
  }
  window.localStorage.setItem(key, item);
};

export const setApplicationStorage = (value) => {
  setItem('application', value);
};

export const getApplicationStorage = () => getItem('application');
