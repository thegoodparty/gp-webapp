'use client'

import { pdf } from '@react-pdf/renderer'
import QRCode from 'qrcode'
import { BriefingPdfDocument } from './BriefingPdfDocument'
import type { Briefing } from '../types'

const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'briefing'

type Options = {
  preparedForLine?: string
  meetingMetaLine?: string
  liveBriefingUrl?: string
}

const buildQrDataUrl = (url: string): Promise<string> =>
  QRCode.toDataURL(url, {
    margin: 1,
    width: 320,
    errorCorrectionLevel: 'M',
    color: { dark: '#1a2a5e', light: '#ffffff' },
  })

export const downloadBriefingPdf = async (
  briefing: Briefing,
  options: Options = {},
): Promise<void> => {
  const liveBriefingQrDataUrl = options.liveBriefingUrl
    ? await buildQrDataUrl(options.liveBriefingUrl)
    : undefined

  const blob = await pdf(
    <BriefingPdfDocument
      briefing={briefing}
      preparedForLine={options.preparedForLine}
      meetingMetaLine={options.meetingMetaLine}
      liveBriefingUrl={options.liveBriefingUrl}
      liveBriefingQrDataUrl={liveBriefingQrDataUrl}
    />,
  ).toBlob()

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${slugify(briefing.title)}.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 100)
}
