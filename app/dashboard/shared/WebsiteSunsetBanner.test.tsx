import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from 'helpers/test-utils/render'
import { WebsiteSunsetBanner } from './WebsiteSunsetBanner'
import { HUBSPOT_DOMAIN_TRANSFER_FORM_URL } from './websiteSunset'

describe('WebsiteSunsetBanner', () => {
  it('shows the discontinuation notice and a Transfer link to the HubSpot form when the candidate has a website', () => {
    render(<WebsiteSunsetBanner hasWebsite />)

    expect(
      screen.getByText('Our build your own website feature is being discontinued'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Please transfer your domain to a provider of your choice.',
      ),
    ).toBeInTheDocument()

    const cta = screen.getByRole('link', { name: 'Transfer' })
    expect(cta).toHaveAttribute('href', HUBSPOT_DOMAIN_TRANSFER_FORM_URL)
    expect(cta).toHaveAttribute('target', '_blank')
    expect(cta).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders nothing when the candidate has no website', () => {
    const { container } = render(<WebsiteSunsetBanner hasWebsite={false} />)

    expect(container).toBeEmptyDOMElement()
    expect(
      screen.queryByText(
        'Our build your own website feature is being discontinued',
      ),
    ).not.toBeInTheDocument()
  })
})
