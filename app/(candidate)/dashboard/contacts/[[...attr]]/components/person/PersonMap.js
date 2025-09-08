'use client'
import { usePerson } from '../../hooks/PersonProvider'
import Map from '@shared/utils/Map'

export default function PersonMap() {
  const [person] = usePerson()
  if (!person) return null

  const places = []

  if (
    person.Residence_Addresses_Latitude &&
    person.Residence_Addresses_Longitude
  ) {
    places.push({
      lat: person.Residence_Addresses_Latitude,
      lng: person.Residence_Addresses_Longitude,
      title:
        `${person.Voters_FirstName || ''} ${
          person.Voters_LastName || ''
        }`.trim() || 'Residence',
      description: person.Residence_Addresses_AddressLine
        ? `${person.Residence_Addresses_AddressLine}${
            person.Residence_Addresses_City
              ? `, ${person.Residence_Addresses_City}`
              : ''
          }${
            person.Residence_Addresses_Zip
              ? ` ${person.Residence_Addresses_Zip}`
              : ''
          }`
        : 'Residence Address',
    })
  }

  if (places.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-500">
          No location data available for this person
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Map
        places={places}
        height="400px"
        showInfoWindows={true}
        fitBounds={true}
      />
    </div>
  )
}
