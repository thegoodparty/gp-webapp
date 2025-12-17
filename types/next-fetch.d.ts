// Extend the global RequestInit interface to include Next.js specific options
declare global {
  interface RequestInit {
    next?: {
      revalidate?: number | false
      tags?: string[]
    }
  }
}

export {}
