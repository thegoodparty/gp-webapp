import { EVENTS, trackEvent } from "helpers/analyticsHelper"
import { useDebounceEffect } from "./useDebounceEffect"

export function useTrackOfficeSearch({ zip, level, officeName }) {
  useDebounceEffect(
    () => {
      const props = {
        zipCode: zip || '',
        officeLevel: level || '',
        officeName: officeName || '',
      }
      if (props.zipCode || props.officeLevel || props.officeName) {
        trackEvent(EVENTS.Onboarding.OfficeSearched, props)
      }
    },
    400,
    [zip, level, officeName]
  )
}