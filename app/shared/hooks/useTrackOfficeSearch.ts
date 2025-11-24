import { trackEvent } from "helpers/analyticsHelper"
import { useDebounceEffect } from "./useDebounceEffect"
import { EVENTS } from "helpers/analyticsHelper"

interface UseTrackOfficeSearchParams {
  zip?: string
  level?: string
  officeName?: string
}

export const useTrackOfficeSearch = ({ zip, level, officeName }: UseTrackOfficeSearchParams): void => {
  useDebounceEffect(
    () => {
      const props = {
        zipCode: zip || '',
        officeLevel: level || '',
        officeName: officeName || '',
      }
      if (props.zipCode || props.officeLevel || props.officeName) {
        trackEvent(EVENTS.Onboarding.OfficeStep.OfficeSearched, props)
      }
    },
    400,
    [zip, level, officeName]
  )
}

