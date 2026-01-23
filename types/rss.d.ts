declare module 'rss' {
  interface FeedOptions {
    title?: string
    site_url?: string
    feed_url?: string
    image_url?: string
    language?: string
    description?: string
  }

  interface ItemOptions {
    title?: string
    description?: string
    date?: string | Date
    url?: string
    link?: string
    guid?: string
    enclosure?: {
      url?: string
      file?: string
      size?: number
      type?: string
    }
  }

  class RSS {
    constructor(options: FeedOptions)
    item(options: ItemOptions): void
    xml(options?: { indent?: boolean | string }): string
  }

  export = RSS
}
