import { reverseObject } from './reverseObject.util'

export const IS_VERIFIED_OPTIONS = {
  Review: null,
  Yes: true,
  No: false,
}

export const IS_VERIFIED_OPTIONS_REVERSED = reverseObject(IS_VERIFIED_OPTIONS)
