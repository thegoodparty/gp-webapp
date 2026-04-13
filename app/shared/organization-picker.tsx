'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { clientRequest } from 'gpApi/typed-request'
import { Organization } from 'gpApi/api-endpoints'
import { setCookie } from 'helpers/cookieHelper'
import { ORG_SLUG_COOKIE } from '@shared/organizations/constants'
import { useSelectedOrgSlug } from '@shared/hooks/useSelectedOrgSlug'
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
import { useIsMobile } from '@styleguide/hooks/use-mobile'
import { usePathname, useRouter } from 'next/navigation'
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

interface OrganizationProviderProps {
  children: ReactNode
  initialOrganizations: Organization[]
}

export const ORGANIZATIONS_QUERY_KEY = ['organizations']

export const OrganizationProvider = ({
  children,
  initialOrganizations,
}: OrganizationProviderProps) => {
  const queryClient = useQueryClient()

  const { data: organizations } = useQuery({
    queryKey: ORGANIZATIONS_QUERY_KEY,
    queryFn: async () =>
      clientRequest('GET /v1/organizations', {}).then(
        (res) => res.data.organizations,
      ),
    initialData: initialOrganizations,
  })

  const [selectedSlug, setRawSelectedSlug] =
    useSelectedOrgSlug(initialOrganizations)

  const selectedOrganization = useMemo(
    () =>
      organizations.find((o) => o.slug === selectedSlug) ?? organizations[0],
    [organizations, selectedSlug],
  )

  useEffect(() => {
    if (selectedOrganization) {
      setCookie(ORG_SLUG_COOKIE, selectedOrganization.slug)
    }
  }, [selectedOrganization])

  const setSelectedSlug = useCallback(
    (slug: string) => {
      setRawSelectedSlug(slug)
      setCookie(ORG_SLUG_COOKIE, slug)
      // Exclude the organizations query from invalidation — the org list doesn't
      // change when switching between orgs, and invalidating it causes a brief
      // flash where nav items disappear while the list refetches.
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] !== ORGANIZATIONS_QUERY_KEY[0],
      })
    },
    [queryClient],
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
              <Logo />
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

const Logo = () => (
  <div className="w-[32px] h-[24px]">
    <svg
      width={32}
      height={24}
      viewBox="0 0 32 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.0021 21.306C21.2331 18.7631 24.7057 15.9097 26.4789 12.9823C27.9714 10.4985 28.1635 8.08866 27.2178 6.09274C26.3607 4.28903 24.6318 3.00278 22.6222 2.66274C20.4795 2.30791 18.3073 3.06192 16.5932 4.93955L15.9873 5.59006L15.3815 4.93955C13.6526 3.06192 11.4804 2.30791 9.3525 2.66274C7.35762 2.98799 5.61395 4.28903 4.75689 6.09274C3.81117 8.07387 4.00327 10.4985 5.49574 12.9823C7.26896 15.9097 10.7415 18.7631 15.9726 21.306H16.0021Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.0022 4.14121C14.0959 2.1453 11.643 1.2878 9.2048 1.70176C6.88482 2.08616 4.87517 3.5794 3.87034 5.6788C2.76207 8.02954 3.02805 10.809 4.66828 13.4998C6.5745 16.6637 10.254 19.6206 15.5736 22.1931L16.0022 22.4001L16.4307 22.1931C21.7504 19.6058 25.415 16.6489 27.336 13.4998C28.9615 10.809 29.2423 8.02954 28.134 5.6788C27.1292 3.56462 25.1195 2.08616 22.7995 1.70176C20.3613 1.30258 17.9084 2.1453 16.0022 4.14121ZM14.6574 5.63445C13.1354 3.97859 11.2883 3.37242 9.5151 3.66811C7.83053 3.94901 6.36762 5.04306 5.65833 6.5363C4.88993 8.1626 4.99337 10.2177 6.35284 12.4797C7.93397 15.0965 11.0815 17.7578 15.9874 20.1972C20.8933 17.7578 24.026 15.0965 25.6219 12.4797C26.9962 10.2177 27.0848 8.1626 26.3164 6.5363C25.6071 5.02828 24.1442 3.94901 22.4597 3.66811C20.6864 3.37242 18.8393 3.97859 17.3173 5.63445L15.9874 7.08333L14.6574 5.63445Z"
        fill="#DC1438"
      />
      <path
        d="M15.4701 14.1653L14.0515 14.9045C13.9037 14.9785 13.7264 14.9193 13.6525 14.7863C13.623 14.7271 13.6082 14.668 13.623 14.5941L13.889 13.0417C13.9481 12.6721 13.8298 12.3025 13.5639 12.0511L12.4113 10.9423C12.293 10.824 12.293 10.6466 12.4113 10.5283C12.4556 10.484 12.5147 10.4544 12.5886 10.4396L14.1845 10.2178C14.5539 10.1587 14.879 9.93693 15.0415 9.59689L15.7508 8.17758C15.8247 8.02973 16.002 7.9706 16.1498 8.04452C16.2089 8.07409 16.2532 8.11844 16.2828 8.17758L16.9921 9.59689C17.1546 9.92215 17.4797 10.1587 17.8491 10.2178L19.4451 10.4396C19.6076 10.4692 19.7258 10.617 19.6963 10.7649C19.6963 10.824 19.6519 10.8831 19.6076 10.9275L18.455 12.0363C18.189 12.2877 18.056 12.6721 18.1299 13.0269L18.3959 14.5793C18.4255 14.7419 18.322 14.8898 18.1595 14.9193C18.1004 14.9193 18.0265 14.9193 17.9674 14.8898L16.5488 14.1505C16.2089 13.9731 15.8099 13.9731 15.4849 14.1505L15.4701 14.1653Z"
        fill="#0048C2"
      />
    </svg>
  </div>
)
