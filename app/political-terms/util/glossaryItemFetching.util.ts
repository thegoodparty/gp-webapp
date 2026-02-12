import { unAuthFetch } from 'gpApi/unAuthFetch'
import { apiRoutes } from 'gpApi/routes'
import { Document } from '@contentful/rich-text-types'

export interface BannerData {
  title?: string
  description?: string
  buttonLabel?: string
  buttonLink?: string
  smallImage?: {
    url?: string
    alt?: string
    size?: { width?: number; height?: number }
  }
  largeImage?: {
    url?: string
    alt?: string
    size?: { width?: number; height?: number }
  }
  bannerClassName?: string
}

export interface GlossaryItem {
  title: string
  slug: string
  description?: Document
  cta?: string
  ctaLink?: string
  banner?: BannerData
}

export type GlossaryBySlug = Partial<Record<string, GlossaryItem>>

export type GlossaryByLetter = Partial<Record<string, GlossaryItem[]>>

export const fetchGlossaryItemsBySlug = async (): Promise<GlossaryBySlug> => {
  try {
    const termsBySlug = await unAuthFetch<GlossaryBySlug>(
      `${apiRoutes.content.byType.path}/glossaryItem/by-slug`,
    )
    return termsBySlug
  } catch (e) {
    return {}
  }
}

export const fetchGlossaryByLetter = async (): Promise<GlossaryByLetter> =>
  await unAuthFetch<GlossaryByLetter>(
    `${apiRoutes.content.byType.path}/glossaryItem/by-letter`,
  )

export const fetchGlossaryByTitle = async (): Promise<GlossaryBySlug> =>
  await unAuthFetch<GlossaryBySlug>(
    `${apiRoutes.content.byType.path}/glossaryItem/by-slug`,
  )
