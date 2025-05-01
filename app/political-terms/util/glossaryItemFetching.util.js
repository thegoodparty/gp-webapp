import { unAuthFetch } from 'gpApi/unAuthFetch'
import { apiRoutes } from 'gpApi/routes'

export const fetchGlossaryItemsBySlug = async () => {
  try {
    const termsBySlug = await unAuthFetch(
      `${apiRoutes.content.byType.path}/glossaryItem/by-slug`,
    )
    return termsBySlug
  } catch (e) {
    return {}
  }
}

export const fetchGlossaryByLetter = async () =>
  await unAuthFetch(`${apiRoutes.content.byType.path}/glossaryItem/by-letter`)

export const fetchGlossaryByTitle = async () =>
  await unAuthFetch(`${apiRoutes.content.byType.path}/glossaryItem/by-slug`)
