export const trackEvent = (name, properties) => {
  try {
    if (typeof FS === 'undefined') {
      return;
    }
    FS('trackEvent', { name, properties });
  } catch (e) {
    console.log('error tracking FullStory event', e);
  }
};
