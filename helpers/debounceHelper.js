export function debounce(func, timeout = 600, ...args) {
  clearTimeout(window.timer);
  window.timer = setTimeout(() => {
    func(...(args.length ? args : []));
  }, timeout);
}

export function debounce2(func, delay) {
  let timeoutId;
  return function (...args) {
    const context = this;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = null;
      func.apply(context, args);
    }, delay);
  };
}
