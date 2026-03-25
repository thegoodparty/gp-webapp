'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useQuery } from '@tanstack/react-query'
import { clientRequest } from 'gpApi/typed-request'
import { Organization } from 'gpApi/api-endpoints'
import { setCookie, getCookie } from 'helpers/cookieHelper'
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
import { queryClient } from './query-client'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCampaign } from './hooks/useCampaign'

const SHARED_PATHS = ['/dashboard/profile', '/dashboard/campaign-details']

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

export const useSetOrganizationSlug = () => {
  const ctx = useContext(OrganizationContext)
  if (!ctx) {
    throw new Error(
      'useSetOrganizationSlug must be used within OrganizationProvider',
    )
  }
  return ctx.setSelectedSlug
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

  const [selectedSlug, _setSelectedSlug] = useState(() => {
    const cookieSlug = getCookie(ORG_SLUG_COOKIE) || null
    const isValid = initialOrganizations.some((o) => o.slug === cookieSlug)
    if (!isValid && initialOrganizations[0]) {
      setCookie(ORG_SLUG_COOKIE, initialOrganizations[0].slug)
      return initialOrganizations[0].slug
    }
    return cookieSlug
  })

  const selectedOrganization = useMemo(
    () =>
      organizations.find((o) => o.slug === selectedSlug) ?? organizations[0],
    [organizations, selectedSlug],
  )

  const setSelectedSlug = useCallback((slug: string) => {
    _setSelectedSlug(slug)
    setCookie(ORG_SLUG_COOKIE, slug)
    // Exclude the organizations query from invalidation — the org list doesn't
    // change when switching between orgs, and invalidating it causes a brief
    // flash where nav items disappear while the list refetches.
    void queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] !== ORGANIZATIONS_QUERY_KEY[0],
    })
  }, [])

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

  const [campaign] = useCampaign()
  const pathname = usePathname()

  if (!ctx || ctx.organizations.length === 0) return null

  const { organizations, selected, setSelectedSlug } = ctx

  const handleOrgSwitch = (org: Organization) => {
    if (org.slug === selected.slug) return
    setSelectedSlug(org.slug)

    const isOnSharedPage = SHARED_PATHS.some((p) => pathname?.startsWith(p))
    if (!isOnSharedPage) {
      router.push(org.electedOfficeId ? '/dashboard/polls' : '/dashboard')
    }
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
              <Image
                src="/images/logo/heart.svg"
                data-cy="logo"
                width={30}
                height={24}
                alt="GoodParty.org"
                priority
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="flex items-center gap-1">
                  <p className="truncate text-sm font-opensans">
                    GoodParty.org
                  </p>
                  {campaign?.isPro && (
                    <div className="bg-primary text-white text-[8px]/[12px] font-opensans font-bold rounded h-[12px] px-1">
                      PRO
                    </div>
                  )}
                </div>
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
