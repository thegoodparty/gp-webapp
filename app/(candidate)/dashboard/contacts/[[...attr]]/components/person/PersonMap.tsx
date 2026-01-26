'use client'
import { useContactsTable } from '../../hooks/ContactsTableProvider'
import Map from '@shared/utils/Map'

interface Place {
  lat: number
  lng: number
  title: string
  description: string
}

export default function PersonMap(): React.JSX.Element | null {
  const { currentlySelectedPerson: person } = useContactsTable()
  if (!person) return null

  const places: Place[] = []

  const latValue = person.lat
  const lngValue = person.lng
  const lat =
    typeof latValue === 'string' || typeof latValue === 'number'
      ? parseFloat(String(latValue))
      : NaN
  const lng =
    typeof lngValue === 'string' || typeof lngValue === 'number'
      ? parseFloat(String(lngValue))
      : NaN

  if (!isNaN(lat) && !isNaN(lng)) {
    const firstNameValue = person.firstName
    const lastNameValue = person.lastName
    const addressValue = person.address

    const firstName = typeof firstNameValue === 'string' ? firstNameValue : ''
    const lastName = typeof lastNameValue === 'string' ? lastNameValue : ''
    const address = typeof addressValue === 'string' ? addressValue : ''

    places.push({
      lat,
      lng,
      title: `${firstName} ${lastName}`.trim() || 'Residence',
      description: address,
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
