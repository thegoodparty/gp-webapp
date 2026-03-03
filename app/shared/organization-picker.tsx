'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useQuery } from '@tanstack/react-query'
import { clientRequest } from 'gpApi/typed-request'
import { Organization } from 'gpApi/api-endpoints'
import { useLocalStorageValue } from './utils/local-storage'
import { useFlagOn } from '@shared/experiments/FeatureFlagsProvider'
import { setCookie, deleteCookie } from 'helpers/cookieHelper'
import { ORG_SLUG_COOKIE } from '@shared/organizations/constants'
import { FaChevronDown } from 'react-icons/fa'
const LS_KEY = 'selected-organization-slug'

interface OrganizationContextValue {
  organizations: Organization[]
  selected: Organization
  setSelectedSlug: (slug: string) => void
}

const OrganizationContext = createContext<OrganizationContextValue | null>(null)

export const useOrganization = () => {
  const ctx = useContext(OrganizationContext)
  if (!ctx) {
    throw new Error('useOrganization must be used within OrganizationProvider')
  }
  return ctx.selected
}

interface OrganizationProviderProps {
  children: ReactNode
  initialOrganizations: Organization[]
  initialSelected: Organization | undefined
}

export const OrganizationProvider = ({
  children,
  initialOrganizations,
  initialSelected,
}: OrganizationProviderProps) => {
  const { on: flagOn } = useFlagOn('organization-picker')

  const { data: organizations = initialOrganizations } = useQuery({
    queryKey: ['organizations'],
    queryFn: () =>
      clientRequest('GET /v1/organizations', {}).then(
        (res) => res.data.organizations,
      ),
    initialData: initialOrganizations,
    enabled: flagOn,
  })

  const [selectedSlug, setSelectedSlug] = useLocalStorageValue(LS_KEY)

  useEffect(() => {
    if (!flagOn) {
      deleteCookie(ORG_SLUG_COOKIE)
      return
    }
    if (selectedSlug) {
      setCookie(ORG_SLUG_COOKIE, selectedSlug)
    }
  }, [flagOn, selectedSlug])

  const selectedOrganization = useMemo(
    () =>
      organizations.find((o) => o.slug === selectedSlug) ?? organizations[0]!,
    [organizations, selectedSlug],
  )

  const value: OrganizationContextValue = {
    organizations,
    selected: selectedOrganization,
    setSelectedSlug,
  }

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  )
}

export const OrganizationPicker = () => {
  const ctx = useContext(OrganizationContext)
  if (!ctx) {
    throw new Error(
      'OrganizationPicker must be used within OrganizationProvider',
    )
  }
  const [open, setOpen] = useState(false)

  const { organizations, selected, setSelectedSlug } = ctx

  return (
    <div className="relative mr-2">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium"
      >
        {selected.position?.name || 'Unknown Organization'}
        <FaChevronDown
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
          size={12}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-50 min-w-[200px] rounded-xl bg-primary-dark text-white shadow-md p-2">
            {organizations.map((org) => (
              <button
                key={org.slug}
                type="button"
                onClick={() => {
                  setSelectedSlug(org.slug)
                  setOpen(false)
                }}
                className={`block w-full rounded px-4 py-2 text-left text-sm hover:bg-primary-dark-dark ${
                  org.slug === selected.slug ? 'bg-primary-dark-dark' : ''
                }`}
              >
                {org.position?.name ?? org.slug}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
