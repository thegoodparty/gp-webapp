import type { Source } from '@shared/briefings/types'

export type DisplaySource = {
  id: string
  displayName: string
  displayBlurb: string | null
  url?: string | null
  isProprietary: boolean
  initial: string
}

// TODO(product): refine the proprietary-source copy with product/design.
const PROPRIETARY_NAME = 'GoodParty.org constituent sentiment'
const PROPRIETARY_BLURB =
  'Modeled estimate from GoodParty.org’s proprietary constituent ' +
  'sentiment data. Methodology details available on request.'

export const toDisplaySource = (s: Source): DisplaySource => {
  if (s.sourceType === 'haystaq') {
    return {
      id: s.id,
      displayName: PROPRIETARY_NAME,
      displayBlurb: PROPRIETARY_BLURB,
      url: null,
      isProprietary: true,
      initial: 'G',
    }
  }
  return {
    id: s.id,
    displayName: s.name,
    displayBlurb: null,
    url: s.url ?? null,
    isProprietary: false,
    initial: (s.name.trim().charAt(0) || '?').toUpperCase(),
  }
}
