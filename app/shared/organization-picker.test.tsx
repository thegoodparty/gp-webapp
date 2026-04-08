import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from 'helpers/test-utils/render'
import { api } from 'helpers/test-utils/api-mocking'
import { queryClient } from '@shared/query-client'
import { Organization } from 'gpApi/api-endpoints'
import { SidebarProvider } from '@styleguide'
import {
  OrganizationProvider,
  OrganizationPicker,
  useOrganization,
} from './organization-picker'

vi.mock('next/navigation', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/navigation')>()
  return {
    ...actual,
    useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn() })),
    usePathname: vi.fn(() => '/dashboard'),
  }
})

vi.mock('./experiments/FeatureFlagsProvider', () => ({
  useFlagOn: vi.fn(() => ({ on: true })),
}))

vi.mock('@styleguide/hooks/use-mobile', () => ({
  useIsMobile: vi.fn(() => false),
}))

vi.mock('./layouts/navigation/HeaderLogo', () => ({
  HeaderLogo: () => <div data-testid="header-logo" />,
}))

const mockSetCookie = vi.fn<(name: string, value: string) => void>()
const mockGetCookie = vi.fn<(name: string) => string | false>(() => false)
vi.mock('helpers/cookieHelper', () => ({
  getCookie: (name: string) => mockGetCookie(name),
  setCookie: (name: string, value: string) => mockSetCookie(name, value),
  deleteCookie: vi.fn(),
}))

const orgs: Organization[] = [
  {
    slug: 'org-one',
    name: 'Organization One',
    positionName: null,
    position: null,
    district: null,
    electedOfficeId: null,
    campaignId: 1,
  },
  {
    slug: 'org-two',
    name: 'Organization Two',
    positionName: null,
    position: null,
    district: null,
    electedOfficeId: 'eo-1',
    campaignId: 2,
  },
  {
    slug: 'org-three',
    name: 'Organization Three',
    positionName: null,
    position: null,
    district: null,
    electedOfficeId: null,
    campaignId: null,
  },
]

beforeEach(() => {
  mockSetCookie.mockClear()
  mockGetCookie.mockReset().mockReturnValue(false)
})

describe('OrganizationProvider', () => {
  it('provides the first organization as default when no cookie is set', () => {
    const Probe = () => {
      const org = useOrganization()
      return <div data-testid="org">{org.slug}</div>
    }

    render(
      <OrganizationProvider initialOrganizations={orgs}>
        <Probe />
      </OrganizationProvider>,
    )

    expect(screen.getByTestId('org')).toHaveTextContent('org-one')
    expect(mockSetCookie).toHaveBeenCalledWith('organization-slug', 'org-one')
  })

  it('selects the org matching the cookie slug', () => {
    mockGetCookie.mockImplementation((name: string) =>
      name === 'organization-slug' ? 'org-two' : false,
    )

    const Probe = () => {
      const org = useOrganization()
      return <div data-testid="org">{org.slug}</div>
    }

    render(
      <OrganizationProvider initialOrganizations={orgs}>
        <Probe />
      </OrganizationProvider>,
    )

    expect(screen.getByTestId('org')).toHaveTextContent('org-two')
  })

  it('falls back to first org when cookie slug does not match any org', () => {
    mockGetCookie.mockImplementation((name: string) =>
      name === 'organization-slug' ? 'nonexistent' : false,
    )

    const Probe = () => {
      const org = useOrganization()
      return <div data-testid="org">{org.slug}</div>
    }

    render(
      <OrganizationProvider initialOrganizations={orgs}>
        <Probe />
      </OrganizationProvider>,
    )

    expect(screen.getByTestId('org')).toHaveTextContent('org-one')
    expect(mockSetCookie).toHaveBeenCalledWith('organization-slug', 'org-one')
  })

  it('renders children without context when no organizations exist', () => {
    render(
      <OrganizationProvider initialOrganizations={[]}>
        <div data-testid="child">hello</div>
      </OrganizationProvider>,
    )

    expect(screen.getByTestId('child')).toHaveTextContent('hello')
  })

  it('throws when useOrganization is used outside the provider', () => {
    const Probe = () => {
      useOrganization()
      return null
    }

    expect(() => render(<Probe />)).toThrow(
      'useOrganization must be used within OrganizationProvider',
    )
  })
})

const renderPicker = (initialOrganizations: Organization[] = orgs) =>
  render(
    <SidebarProvider>
      <OrganizationProvider initialOrganizations={initialOrganizations}>
        <OrganizationPicker />
      </OrganizationProvider>
    </SidebarProvider>,
  )

describe('OrganizationPicker', () => {
  it('renders nothing when there are no organizations', () => {
    renderPicker([])
    expect(screen.queryByText('GoodParty.org')).not.toBeInTheDocument()
  })

  it('displays the selected organization name', () => {
    renderPicker()
    expect(screen.getByText('Organization One')).toBeInTheDocument()
  })

  it('shows all organizations in the dropdown', async () => {
    const user = userEvent.setup()
    renderPicker()

    await user.click(screen.getByText('Organization One'))

    const allOrgOneElements = screen.getAllByText('Organization One')
    expect(allOrgOneElements.length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText('Organization Two')).toBeInTheDocument()
    expect(screen.getByText('Organization Three')).toBeInTheDocument()
  })

  it('sets the cookie when switching orgs', async () => {
    const user = userEvent.setup()
    renderPicker()

    await user.click(screen.getByText('Organization One'))
    await user.click(screen.getByText('Organization Two'))

    await waitFor(() => {
      expect(mockSetCookie).toHaveBeenCalledWith('organization-slug', 'org-two')
    })
  })

  it('fetches organizations from the API', async () => {
    const updatedOrgs: Organization[] = [
      {
        slug: 'fetched',
        name: 'Fetched Org',
        positionName: null,
        position: null,
        district: null,
        electedOfficeId: null,
        campaignId: 10,
      },
    ]

    api.mock('GET /v1/organizations', {
      status: 200,
      data: { organizations: updatedOrgs },
    })

    queryClient.setDefaultOptions({
      queries: { staleTime: 0, retry: false },
    })

    renderPicker()

    await waitFor(() => {
      expect(screen.getByText('Fetched Org')).toBeInTheDocument()
    })

    queryClient.setDefaultOptions({
      queries: { staleTime: 1000 * 60 * 5, retry: 2 },
    })
  })
})

describe('X-Organization-Slug header attachment', () => {
  it('gpFetch attaches the header when the org cookie is set', async () => {
    mockGetCookie.mockImplementation((name: string) =>
      name === 'organization-slug' ? 'org-one' : false,
    )

    let capturedHeader: string | undefined
    api.mock('GET /v1/organizations', ({ headers }) => {
      capturedHeader = headers['x-organization-slug']
      return {
        status: 200,
        data: { organizations: orgs },
      }
    })

    const gpFetch = (await import('gpApi/gpFetch')).default
    await gpFetch({ url: '/api/v1/organizations', method: 'GET' })

    expect(capturedHeader).toBe('org-one')
  })

  it('gpFetch does not attach the header when no org cookie exists', async () => {
    mockGetCookie.mockReturnValue(false)

    let capturedHeader: string | undefined
    api.mock('GET /v1/organizations', ({ headers }) => {
      capturedHeader = headers['x-organization-slug']
      return {
        status: 200,
        data: { organizations: orgs },
      }
    })

    const gpFetch = (await import('gpApi/gpFetch')).default
    await gpFetch({ url: '/api/v1/organizations', method: 'GET' })

    expect(capturedHeader).toBeUndefined()
  })

  it('handleApiRequestRewrite attaches the header from cookies', async () => {
    const { handleApiRequestRewrite } = await import(
      'helpers/handleApiRequestRewrite'
    )

    const reqUrl = new URL('http://localhost:4000/api/v1/organizations')
    const request = new Request(reqUrl.toString())

    const headersSpy = vi.spyOn(request.headers, 'set')

    Object.defineProperty(request, 'cookies', {
      value: {
        get: (name: string) => {
          if (name === 'organization-slug') return { value: 'org-two' }
          return undefined
        },
      },
    })

    Object.defineProperty(request, 'nextUrl', {
      value: reqUrl,
    })

    await handleApiRequestRewrite(request as any, null)

    expect(headersSpy).toHaveBeenCalledWith('X-Organization-Slug', 'org-two')
  })

  it('handleApiRequestRewrite does not attach header when no org cookie exists', async () => {
    const { handleApiRequestRewrite } = await import(
      'helpers/handleApiRequestRewrite'
    )

    const reqUrl = new URL('http://localhost:4000/api/v1/organizations')
    const request = new Request(reqUrl.toString())

    const headersSpy = vi.spyOn(request.headers, 'set')

    Object.defineProperty(request, 'cookies', {
      value: {
        get: () => undefined,
      },
    })

    Object.defineProperty(request, 'nextUrl', {
      value: reqUrl,
    })

    await handleApiRequestRewrite(request as any, null)

    expect(headersSpy).not.toHaveBeenCalledWith(
      'X-Organization-Slug',
      expect.anything(),
    )
  })
})
