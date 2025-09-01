export const urlIncludesPath = (urlStr) =>
  // optional protocol, but must have path (e.g. http://example.com/path not just http://example.com)
  /^(https?:\/\/)?[^\/\s]+\/[^\/\s]+.*$/i.test(urlStr)
