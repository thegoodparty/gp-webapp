// export const validateLink = (link) => {
//     if (!link) {
//       return false;
//     }
//     return link.includes('https://') || link.includes('http://')
//       ? link
//       : `https://${link}`;
//   };

//   export const getValidImgUrl = (url) => {
//     if (!url) {
//       return '';
//     }
//     return url.replace('thegoodparty.org', 'goodparty.org');
//   };

export const isValidUrl = (str) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+@]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return !!pattern.test(str);
};
