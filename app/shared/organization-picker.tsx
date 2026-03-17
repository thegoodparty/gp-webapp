'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react'
import { useQuery } from '@tanstack/react-query'
import { clientRequest } from 'gpApi/typed-request'
import { Organization } from 'gpApi/api-endpoints'
import { useLocalStorageValue } from './utils/local-storage'
import { setCookie, deleteCookie } from 'helpers/cookieHelper'
import { ORG_SLUG_COOKIE } from '@shared/organizations/constants'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@styleguide'
import { ChevronDown } from 'lucide-react'
import { useFlagOn } from './experiments/FeatureFlagsProvider'
import { useIsMobile } from '@styleguide/hooks/use-mobile'
import { HeaderLogo } from './layouts/navigation/HeaderLogo'
import { queryClient } from './query-client'
import { useRouter } from 'next/navigation'

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

export const useOrganizationIfEnabled = () => {
  const { on: enabled } = useFlagOn('win-serve-split')

  const ctx = useContext(OrganizationContext)

  if (!enabled) {
    return undefined
  }

  if (!ctx) {
    console.warn(
      'useOrganizationIfEnabled must be used within OrganizationProvider',
    )
    return undefined
  }
  return ctx.selected
}

interface OrganizationProviderProps {
  children: ReactNode
  initialOrganizations: Organization[]
}

export const ORGANIZATIONS_QUERY_KEY = ['organizations']

export const OrganizationProvider = ({
  children,
  initialOrganizations,
}: OrganizationProviderProps) => {
  const { on: enabled } = useFlagOn('win-serve-split')

  const { data: organizations } = useQuery({
    queryKey: ORGANIZATIONS_QUERY_KEY,
    queryFn: async () =>
      clientRequest('GET /v1/organizations', {}).then(
        (res) => res.data.organizations,
      ),
    initialData: initialOrganizations,
    enabled,
  })

  const [selectedSlug, _setSelectedSlug] = useLocalStorageValue(LS_KEY)

  useEffect(() => {
    if (!enabled) {
      deleteCookie(ORG_SLUG_COOKIE)
      return
    }
    const slug = selectedSlug ?? organizations[0]?.slug
    if (slug) {
      setCookie(ORG_SLUG_COOKIE, slug)
    }
  }, [enabled, selectedSlug, organizations])

  const selectedOrganization = useMemo(
    () =>
      organizations.find((o) => o.slug === selectedSlug) ?? organizations[0],
    [organizations, selectedSlug],
  )

  const setSelectedSlug = useCallback(
    (slug: string) => {
      _setSelectedSlug(slug)
      setCookie(ORG_SLUG_COOKIE, slug)
      // When we change the org, we need to refetch just about everything.
      queryClient.invalidateQueries()
    },
    [_setSelectedSlug],
  )

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        selected: selectedOrganization!,
        setSelectedSlug,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  )
}

export const OrganizationPicker = () => {
  const ctx = useContext(OrganizationContext)
  const router = useRouter()

  const isMobile = useIsMobile()

  if (!ctx || ctx.organizations.length === 0) return null

  const { organizations, selected, setSelectedSlug } = ctx

  const handleOrgSwitch = (org: Organization) => {
    if (org.slug === selected.slug) return
    setSelectedSlug(org.slug)
    router.push(org.electedOfficeId ? '/dashboard/polls' : '/dashboard')
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <HeaderLogo />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-xs font-opensans">
                  GoodParty.org
                </span>
                <span className="truncate text-sm font-opensans font-semibold">
                  {selected.name}
                </span>
              </div>
              <ChevronDown className="ml-auto self-end" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-(--radix-dropdown-menu-trigger-width) rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              {organizations.map((org) => {
                const isSelected = org.slug === selected.slug
                return (
                  <DropdownMenuItem
                    key={org.slug}
                    onClick={() => handleOrgSwitch(org)}
                    className="gap-2 px-2 py-2.5"
                  >
                    <span
                      className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
                        isSelected
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      }`}
                    >
                      {isSelected && (
                        <span className="size-1.5 rounded-full bg-white" />
                      )}
                    </span>
                    <span className="text-sm font-opensans">{org.name}</span>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
