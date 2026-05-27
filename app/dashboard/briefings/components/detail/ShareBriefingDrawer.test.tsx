import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import type { Briefing } from '@shared/briefings/types'
import ShareBriefingDrawer from './ShareBriefingDrawer'

vi.mock('appEnv', () => ({
  APP_BASE: 'https://goodparty.example',
}))

const BRIEFING_ID = '01923456-7891-7abc-8def-0123456789ab'
const SHARE_URL = `https://goodparty.example/api/v1/briefings/${BRIEFING_ID}`

const briefingStub = {
  experiment_id: 'x',
  briefing_id: BRIEFING_ID,
  briefing_type: 'city_council_meeting',
  briefing_status: 'briefing_ready',
  generated_at: '2026-05-11T00:00:00.000Z',
  official_name: 'Renee Wells',
  meeting_date: '2026-05-11',
  meeting_name: 'City Council',
  meeting_time: '18:00',
  meeting_timezone: 'America/Chicago',
  location: 'City Hall Council Chambers',
  estimated_read_minutes: 4,
  executive_summary: { items: [], lead_in: '' },
  items: [],
  sources: [],
  title: 'City Council meeting briefing for May 11, 2026',
} as unknown as Briefing

describe('<ShareBriefingDrawer>', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders header, subtext, four share actions, and URL pill', () => {
    render(
      <ShareBriefingDrawer
        briefing={briefingStub}
        open
        onOpenChange={vi.fn()}
      />,
    )
    expect(screen.getByText(/^Share briefing$/)).toBeInTheDocument()
    expect(
      screen.getByText(
        /City Council.*Mon May 11.*6:00 PM.*City Hall Council Chambers/,
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^copy link$/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /share via email/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /share via message/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /download pdf/i }),
    ).toBeInTheDocument()
    expect(screen.getByTestId('share-briefing-url')).toHaveTextContent(
      SHARE_URL,
    )
    expect(screen.getByRole('button', { name: /^copy$/i })).toBeInTheDocument()
  })

  it('Email button targets a mailto URL with subject and PDF link', () => {
    render(
      <ShareBriefingDrawer
        briefing={briefingStub}
        open
        onOpenChange={vi.fn()}
      />,
    )
    const email = screen.getByRole('link', { name: /share via email/i })
    const href = email.getAttribute('href') ?? ''
    expect(href).toMatch(/^mailto:\?/)
    expect(href).toContain(`subject=${encodeURIComponent(briefingStub.title)}`)
    expect(href).toContain(`body=${encodeURIComponent(SHARE_URL)}`)
  })

  it('Message button targets an sms: URL with the PDF link as body', () => {
    render(
      <ShareBriefingDrawer
        briefing={briefingStub}
        open
        onOpenChange={vi.fn()}
      />,
    )
    const sms = screen.getByRole('link', { name: /share via message/i })
    expect(sms.getAttribute('href')).toBe(
      `sms:?body=${encodeURIComponent(SHARE_URL)}`,
    )
  })

  it('Download button links to the same share URL with the download hint', () => {
    render(
      <ShareBriefingDrawer
        briefing={briefingStub}
        open
        onOpenChange={vi.fn()}
      />,
    )
    const download = screen.getByRole('link', { name: /download pdf/i })
    expect(download.getAttribute('href')).toBe(SHARE_URL)
    expect(download.hasAttribute('download')).toBe(true)
  })

  it('Copy link writes the share URL to the clipboard and reflects the state', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
    render(
      <ShareBriefingDrawer
        briefing={briefingStub}
        open
        onOpenChange={vi.fn()}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: /^copy link$/i }))
    expect(writeText).toHaveBeenCalledWith(SHARE_URL)
    // After click the visible label flips to "Copied" so the user sees
    // immediate feedback even without a global toast.
    expect(await screen.findByText(/copied/i)).toBeInTheDocument()
  })

  it('inline Copy button next to the URL also writes the share URL', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
    render(
      <ShareBriefingDrawer
        briefing={briefingStub}
        open
        onOpenChange={vi.fn()}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: /^copy$/i }))
    expect(writeText).toHaveBeenCalledWith(SHARE_URL)
    expect(
      await screen.findByRole('button', { name: /^copied$/i }),
    ).toBeInTheDocument()
  })
})
