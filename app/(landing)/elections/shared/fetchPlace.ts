import { electionApiRoutes } from 'gpApi/routes'
import unAuthElectionFetch from 'electionApi/unAuthElectionFetch'
import { Place, Race, PlaceChild } from './types'

interface FetchPlaceParams {
  slug: string
  includeRaces?: boolean
  includeParent?: boolean
  categorizeChildren?: boolean
  placeColumns?: string
}

interface PlaceParent {
  name: string
  slug: string
  state: string
  geoId?: string
}

export interface PlaceResult {
  slug: string
  name?: string
  geoId?: string
  state?: string
  cityLargest?: string
  countyName?: string
  population?: number
  density?: number
  incomeHouseholdMedian?: number
  unemploymentRate?: number
  homeValue?: number
  races?: Race[]
  children?: PlaceChild[]
  parent?: PlaceParent
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
