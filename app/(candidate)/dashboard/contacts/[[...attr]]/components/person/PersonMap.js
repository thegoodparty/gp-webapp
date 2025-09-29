'use client'
import { usePerson } from '../../hooks/PersonProvider'
import Map from '@shared/utils/Map'

export default function PersonMap() {
  const [person] = usePerson()
  if (!person) return null

  const places = []

  const lat = parseFloat(person.lat)
  const lng = parseFloat(person.lng)
  if (!isNaN(lat) && !isNaN(lng)) {
    places.push({
      lat,
      lng,
      title:
        `${person.firstName || ''} ${person.lastName || ''}`.trim() ||
        'Residence',
      description: person.address ? person.address : '',
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
