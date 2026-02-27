interface AddressComponent {
  types: string[]
  long_name: string
  short_name: string
}

interface Address {
  place_id: string
  formatted_address: string
  address_components?: AddressComponent[]
}

interface PostalAddress {
  postalCode: string
  state: string
  city: string
  streetLines: string[]
}

interface FormData {
  ein: string
  address: Address
  campaignCommitteeName: string
  website: string
  electionFilingLink: string
  email: string
  phone: string
  officeLevel: string
  fecCommitteeId?: string
  committeeType?: string
}

interface MappedFormData {
  ein: string
  placeId: string
  formattedAddress: string
  committeeName: string
  websiteDomain: string
  filingUrl: string
  email: string
  phone: string
  officeLevel: string
  fecCommitteeId?: string
  committeeType?: string
}

// TODO: refactor the API to accept the entire Google Places address object so
//  that we don't have to extract the postal address here, we can just pass it
//  along
export const extractPostalAddress = (address: Address): PostalAddress => {
  if (!address || !address.address_components) {
    return {
      postalCode: '',
      state: '',
      city: '',
      streetLines: [],
    }
  }

  const { address_components } = address

  const extractAddressComponent = (
    types: string | string[],
  ): AddressComponent => {
    const typeArray = Array.isArray(types) ? types : [types]
    const component = address_components.find((comp) =>
      typeArray.some((type) => comp.types.includes(type)),
    )
    return component || { types: [], long_name: '', short_name: '' }
  }

  const streetNumber = extractAddressComponent('street_number').long_name
  const route = extractAddressComponent('route').long_name
  const streetLine =
    streetNumber && route ? `${streetNumber} ${route}` : route || ''

  return {
    postalCode: extractAddressComponent('postal_code').long_name,
    state: extractAddressComponent('administrative_area_level_1').short_name,
    city: extractAddressComponent(['locality', 'neighborhood']).long_name,
    streetLines: streetLine ? [streetLine] : [],
  }
}

export const mapFormData = ({
  ein,
  address: { place_id, formatted_address },
  campaignCommitteeName,
  website,
  electionFilingLink,
  email,
  phone,
  officeLevel,
  fecCommitteeId,
  committeeType,
}: FormData): MappedFormData => ({
  ein,
  placeId: place_id,
  formattedAddress: formatted_address,
  committeeName: campaignCommitteeName,
  websiteDomain: website,
  filingUrl: electionFilingLink,
  email,
  phone,
  officeLevel,
  fecCommitteeId,
  committeeType,
})
