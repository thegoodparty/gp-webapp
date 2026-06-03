'use client'

import { pdf } from '@react-pdf/renderer'
import QRCode from 'qrcode'
import { CampaignPlanPdfDocument } from './CampaignPlanPdfDocument'
import type { PlanData } from '../components/planContent'

const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'campaign-plan'

type Options = {
  liveUrl?: string
}

const buildQrDataUrl = (url: string): Promise<string> =>
  QRCode.toDataURL(url, {
    margin: 1,
    width: 320,
    errorCorrectionLevel: 'M',
    color: { dark: '#1a2a5e', light: '#ffffff' },
  })

export const downloadCampaignPlanPdf = async (
  plan: PlanData,
  options: Options = {},
): Promise<void> => {
  const liveQrDataUrl = options.liveUrl
    ? await buildQrDataUrl(options.liveUrl)
    : undefined

  const blob = await pdf(
    <CampaignPlanPdfDocument
      plan={plan}
      liveUrl={options.liveUrl}
      liveQrDataUrl={liveQrDataUrl}
    />,
  ).toBlob()

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${slugify(
    plan.candidateName || 'campaign-plan',
  )}-campaign-plan.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 100)
}
