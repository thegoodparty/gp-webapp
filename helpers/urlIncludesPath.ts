export const urlIncludesPath = (urlStr: string): boolean =>
  /^(https?:\/\/)?[^\/\s]+\/[^\/\s]+.*$/i.test(urlStr)
