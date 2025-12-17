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

interface IsVerifiedOptionsReversed {
  'null': 'Review'
  'true': 'Yes'
  'false': 'No'
}

export const IS_VERIFIED_OPTIONS_REVERSED: IsVerifiedOptionsReversed = {
  'null': 'Review',
  'true': 'Yes',
  'false': 'No',
}
