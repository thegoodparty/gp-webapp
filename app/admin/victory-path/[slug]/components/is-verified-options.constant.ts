// Maps display labels to isVerified boolean values from Prisma Campaign model
export interface IsVerifiedOptions {
  Review: null
  Yes: true
  No: false
}

export const IS_VERIFIED_OPTIONS: IsVerifiedOptions = {
  Review: null,
  Yes: true,
  No: false,
}

type IsVerifiedOptionsReversedKey = 'null' | 'true' | 'false'

interface IsVerifiedOptionsReversed {
  null: 'Review'
  true: 'Yes'
  false: 'No'
}

export const IS_VERIFIED_OPTIONS_REVERSED: IsVerifiedOptionsReversed = {
  null: 'Review',
  true: 'Yes',
  false: 'No',
}

const isValidIsVerifiedKey = (
  key: string,
): key is IsVerifiedOptionsReversedKey => {
  return key in IS_VERIFIED_OPTIONS_REVERSED
}

export const getIsVerifiedDisplay = (
  value: boolean | null | undefined,
): string | undefined => {
  const key = String(value)
  if (isValidIsVerifiedKey(key)) {
    return IS_VERIFIED_OPTIONS_REVERSED[key]
  }
  return undefined
}
