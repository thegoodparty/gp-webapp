export function debounce(func, args, timeout = 600) {
  clearTimeout(window.timer);
  window.timer = setTimeout(() => {
    func(args);
  }, timeout);
}
