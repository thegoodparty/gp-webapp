import { unAuthFetch } from 'gpApi/unAuthFetch'
import { apiRoutes } from 'gpApi/routes'

export const fetchGlossaryItemsBySlug = async (): Promise<Record<string, string | number | boolean | object | null>> => {
  try {
    const termsBySlug = await unAuthFetch(
      `${apiRoutes.content.byType.path}/glossaryItem/by-slug`,
    )
    return termsBySlug as Record<string, string | number | boolean | object | null>
  } catch (e) {
    return {}
  }
}

export const fetchGlossaryByLetter = async (): Promise<Record<string, string | number | boolean | object | null>> =>
  await unAuthFetch(`${apiRoutes.content.byType.path}/glossaryItem/by-letter`)

export const fetchGlossaryByTitle = async (): Promise<Record<string, string | number | boolean | object | null>> =>
  await unAuthFetch(`${apiRoutes.content.byType.path}/glossaryItem/by-slug`)
