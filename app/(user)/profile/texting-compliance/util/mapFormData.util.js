// TODO: refactor the API to accept the entire Google Places address object so
//  that we don't have to extract the postal address here, we can just pass it
//  along
const extractPostalAddress = (address) => {
  if (!address || !address.address_components) {
    return {
      postalCode: '',
      state: '',
      city: '',
      streetLines: [],
    }
  }

  const { address_components } = address

  const extractAddressComponent = (types) => {
    const typeArray = Array.isArray(types) ? types : [types]
    const component = address_components.find((comp) =>
      typeArray.some((type) => comp.types.includes(type)),
    )
    return component || {}
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
  matchingContactFields,
}) => ({
  ein,
  placeId: place_id,
  formattedAddress: formatted_address,
  committeeName: campaignCommitteeName,
  websiteDomain: website,
  filingUrl: electionFilingLink,
  email,
  phone,
  matchingContactFields,
})
