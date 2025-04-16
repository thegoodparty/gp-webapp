import gpApi from 'gpApi'
import gpFetch from 'gpApi/gpFetch'

const fetchPlace = async ({
  slug,
  includeRaces = true,
  includeParent = false,
}) => {
  const api = gpApi.elections.places
  const payload = {
    slug,
    includeChildren: true,
    includeRaces,
    raceColumns: 'slug,normalizedPositionName,electionDate,positionDescription,positionLevel',
    includeParent,
  }
  const res = await gpFetch(api, payload, 3600)
  if (Array.isArray(res)) {
    return res[0]
  }
  return {}
}
export default fetchPlace
