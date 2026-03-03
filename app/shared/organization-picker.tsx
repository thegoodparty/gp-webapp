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
}

export const OrganizationProvider = ({
  children,
  initialOrganizations,
}: OrganizationProviderProps) => {
  const { on: flagOn } = useFlagOn('organization-picker')

  const { data: organizations } = useQuery({
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
      organizations.find((o) => o.slug === selectedSlug) ?? organizations[0],
    [organizations, selectedSlug],
  )

  if (!selectedOrganization) {
    return <>{children}</>
  }

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        selected: selectedOrganization,
        setSelectedSlug,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  )
}

export const OrganizationPicker = () => {
  const { on: flagOn } = useFlagOn('win-serve-split')
  const ctx = useContext(OrganizationContext)
  const [open, setOpen] = useState(false)

  console.log({ flagOn, ctx })

  if (!flagOn || !ctx || ctx.organizations.length === 0) return null

  const { organizations, selected, setSelectedSlug } = ctx

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1 text-sm font-medium"
      >
        {selected.name}
        <FaChevronDown
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
          size={12}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-10 z-50 min-w-[250px] rounded-xl bg-white shadow-lg py-2">
            {organizations.map((org) => {
              const isSelected = org.slug === selected.slug
              return (
                <button
                  key={org.slug}
                  type="button"
                  onClick={() => {
                    setSelectedSlug(org.slug)
                    setOpen(false)
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-900 hover:bg-gray-50"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-400'
                    }`}
                  >
                    {isSelected && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </span>
                  {org.name}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
