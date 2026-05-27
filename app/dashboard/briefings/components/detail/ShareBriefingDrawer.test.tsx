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

/**
 * Mount the drawer in its open state. Every test in this file opens the
 * drawer up-front; the close interaction is owned by `<Sheet>` and isn't
 * worth re-asserting here.
 */
function renderOpen() {
  render(
    <ShareBriefingDrawer briefing={briefingStub} open onOpenChange={vi.fn()} />,
  )
}

/**
 * Replace `navigator.clipboard` with a writeText mock. Returns the mock so
 * the caller can assert on its arguments.
 */
function mockClipboard(impl: () => Promise<unknown>) {
  const writeText = vi.fn(impl)
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  })
  return writeText
}

describe('<ShareBriefingDrawer>', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('shows the "Share briefing" title', () => {
    renderOpen()
    expect(
      screen.getByRole('heading', { name: /^share briefing$/i }),
    ).toBeInTheDocument()
  })

  it('renders the exact meeting subtext from name + date + time + location', () => {
    renderOpen()
    expect(
      screen.getByText(
        'City Council · Mon May 11 · 6:00 PM · City Hall Council Chambers',
      ),
    ).toBeInTheDocument()
  })

  it('exposes the four share actions as accessible controls', () => {
    renderOpen()
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
  })

  it('renders the share URL inside the URL pill', () => {
    renderOpen()
    expect(screen.getByTestId('share-briefing-url')).toHaveTextContent(
      SHARE_URL,
    )
  })

  it('renders an inline Copy button next to the URL pill', () => {
    renderOpen()
    expect(screen.getByRole('button', { name: /^copy$/i })).toBeInTheDocument()
  })

  it('Email button targets a mailto URL with subject and PDF link', () => {
    renderOpen()
    const email = screen.getByRole('link', { name: /share via email/i })
    const href = email.getAttribute('href') ?? ''
    expect(href).toMatch(/^mailto:\?/)
    expect(href).toContain(`subject=${encodeURIComponent(briefingStub.title)}`)
    expect(href).toContain(`body=${encodeURIComponent(SHARE_URL)}`)
  })

  it('Message button targets an sms: URL with the PDF link as body', () => {
    renderOpen()
    const sms = screen.getByRole('link', { name: /share via message/i })
    expect(sms.getAttribute('href')).toBe(
      `sms:?body=${encodeURIComponent(SHARE_URL)}`,
    )
  })

  it('Download button links to the same share URL with the download hint', () => {
    renderOpen()
    const download = screen.getByRole('link', { name: /download pdf/i })
    expect(download.getAttribute('href')).toBe(SHARE_URL)
    expect(download.hasAttribute('download')).toBe(true)
  })

  it('Copy link writes the share URL to the clipboard', async () => {
    const writeText = mockClipboard(async () => undefined)
    renderOpen()
    await userEvent.click(screen.getByRole('button', { name: /^copy link$/i }))
    expect(writeText).toHaveBeenCalledWith(SHARE_URL)
  })

  it('Copy link flips its sibling caption to "Copied" after a successful write', async () => {
    // The IconButton keeps its `aria-label="Copy link"` for screen readers
    // (the click target is unchanged), but the caption text below it flips
    // from "Copy link" to "Copied" for sighted feedback.
    const writeText = mockClipboard(async () => undefined)
    renderOpen()
    await userEvent.click(screen.getByRole('button', { name: /^copy link$/i }))
    expect(writeText).toHaveBeenCalledWith(SHARE_URL)
    expect(await screen.findByText('Copied')).toBeInTheDocument()
  })

  it('inline Copy button writes the share URL to the clipboard', async () => {
    const writeText = mockClipboard(async () => undefined)
    renderOpen()
    await userEvent.click(screen.getByRole('button', { name: /^copy$/i }))
    expect(writeText).toHaveBeenCalledWith(SHARE_URL)
  })

  it('inline Copy button text flips to "Copied" after success', async () => {
    // Unlike the IconButton, the inline button's accessible name *is* its
    // text content, so the rename is observable via getByRole.
    mockClipboard(async () => undefined)
    renderOpen()
    await userEvent.click(screen.getByRole('button', { name: /^copy$/i }))
    expect(
      await screen.findByRole('button', { name: /^copied$/i }),
    ).toBeInTheDocument()
  })

  it('does not surface "Copied" feedback if clipboard.writeText rejects', async () => {
    // Simulates a denied permission / non-secure-context failure. The
    // component swallows the error silently so the UI doesn't claim to have
    // copied something it didn't. We assert via queryByText / queryByRole
    // (synchronous: no state change should ever happen).
    mockClipboard(async () => {
      throw new Error('NotAllowedError')
    })
    renderOpen()

    await userEvent.click(screen.getByRole('button', { name: /^copy link$/i }))
    await userEvent.click(screen.getByRole('button', { name: /^copy$/i }))

    expect(screen.queryByText(/^copied$/)).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /^copied$/i }),
    ).not.toBeInTheDocument()
  })
})
