export function debounce(func, timeout = 600, ...args) {
  clearTimeout(window.timer);
  window.timer = setTimeout(() => {
    func(...(args.length ? args : []));
  }, timeout);
}
