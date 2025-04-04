import { StandaloneSearchBox } from '@react-google-maps/api'
import { useContext, useRef } from 'react'
import { MapContext } from './MapSection'

export default function Search() {
  const searchBoxRef = useRef(null)
  const { onPlacesChanged, isLoaded } = useContext(MapContext)

  const handleChange = () => {
    const places = searchBoxRef.current.getPlaces()
    onPlacesChanged(places)
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
