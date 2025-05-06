import gpApi from 'gpApi'
import gpFetch from 'gpApi/gpFetch'

const fetchPlace = async ({
  slug,
  includeRaces = true,
  includeParent = false,
  categorizeChildren = false,
}) => {
  const api = gpApi.elections.places
  const payload = {
    slug: slug.toLowerCase(),
    includeChildren: true,
    includeRaces,
    raceColumns:
      'slug,normalizedPositionName,electionDate,positionDescription,positionLevel',
    includeParent,
    categorizeChildren,
  }
  const res = await gpFetch(api, payload, 3600)
  if (Array.isArray(res)) {
    return res[0]
  }
  return false
}
export default fetchPlace
