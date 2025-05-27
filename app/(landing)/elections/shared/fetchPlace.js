import { electionApiRoutes } from 'gpApi/routes'
import unAuthElectionFetch from 'electionApi/unAuthElectionFetch'

const fetchPlace = async ({
  slug,
  includeRaces = true,
  includeParent = false,
  categorizeChildren = false,
  placeColumns = ''
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
    ...(placeColumns ? { placeColumns } : {})
  }

  const res = await unAuthElectionFetch(api, payload, 3600)
  if (Array.isArray(res)) {
    return res[0]
  }
  return false
}
export default fetchPlace
