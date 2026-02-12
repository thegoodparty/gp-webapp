import { StandaloneSearchBox } from '@react-google-maps/api'
import { useRef } from 'react'

interface SearchProps {
  onPlacesChanged?: (places: google.maps.places.PlaceResult[]) => void
  isLoaded?: boolean
}

export default function Search({
  onPlacesChanged,
  isLoaded,
}: SearchProps = {}): React.JSX.Element | null {
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null)

  const handleChange = () => {
    const places = searchBoxRef.current?.getPlaces()
    if (places && onPlacesChanged) {
      onPlacesChanged(places)
    }
  }

  if (!isLoaded) return null

  return (
    <StandaloneSearchBox
      onLoad={(ref) => (searchBoxRef.current = ref)}
      onPlacesChanged={handleChange}
    >
      <input
        type="text"
        placeholder="Search places..."
        className="p-2 w-full border border-gray-300 rounded"
      />
    </StandaloneSearchBox>
  )
}
