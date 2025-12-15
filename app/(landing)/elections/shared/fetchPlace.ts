import { electionApiRoutes } from 'gpApi/routes'
import unAuthElectionFetch from 'electionApi/unAuthElectionFetch'
import { Place, Race } from './types'

interface FetchPlaceParams {
  slug: string
  includeRaces?: boolean
  includeParent?: boolean
  categorizeChildren?: boolean
  placeColumns?: string
}

interface PlaceResult extends Place {
  races?: Race[]
  children?: Place[]
  parent?: Place
  categorizedChildren?: {
    counties?: Place[]
    districts?: Place[]
    others?: Place[]
  }
}

const fetchPlace = async ({
  slug,
  includeRaces = true,
  includeParent = false,
  categorizeChildren = false,
  placeColumns = ''
}: FetchPlaceParams): Promise<PlaceResult | false> => {
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
