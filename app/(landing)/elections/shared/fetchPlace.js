import { electionApiRoutes } from 'gpApi/routes'
import { unAuthFetch } from 'gpApi/unAuthFetch'

const fetchPlace = async ({
  slug,
  includeRaces = true,
  includeParent = false,
  categorizeChildren = false,
}) => {
  const api = electionApiRoutes.places.find.path
  const payload = {
    slug: slug.toLowerCase(),
    includeChildren: true,
    includeRaces,
    raceColumns:
      'slug,normalizedPositionName,electionDate,positionDescription,positionLevel',
    includeParent,
    categorizeChildren,
  }
  const res = await unAuthFetch(api, payload, 3600)
  if (Array.isArray(res)) {
    return res[0]
  }
  return false
}
export default fetchPlace
