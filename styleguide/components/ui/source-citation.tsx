'use client'

import * as React from 'react'
import { ExternalLink, X } from 'lucide-react'

import { useIsMobile } from '@styleguide/hooks/use-mobile'
import {
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerTitle,
  DrawerTrigger,
} from './drawer'
import { Popover, PopoverAnchor, PopoverContent } from './popover'
import { cn } from '@styleguide/lib/utils'

const CLOSE_DELAY_MS = 150

interface SourceCitationProps {
  organization: string
  /**
   * Logo node to show in the chip and popover. Optional — if omitted and
   * `url` is set, the component renders the source domain's favicon. If
   * neither is provided, the logo slot is left empty.
   */
  organizationLogo?: React.ReactNode
  title: string
  description: string
  url?: string
  chipLabel?: string
  internalFooter?: string
  className?: string
}

function deriveDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function FaviconImg({ domain }: { domain: string }): React.JSX.Element {
  // Google's public favicon service — reliable size + format for any domain.
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
      alt=""
      aria-hidden="true"
      className="size-full object-contain"
    />
  )
}

interface ResolvedSource {
  isExternal: boolean
  domain: string
  resolvedChipLabel: string
  resolvedLogo: React.ReactNode
}

function resolveSource({
  organization,
  organizationLogo,
  url,
  chipLabel,
}: Pick<
  SourceCitationProps,
  'organization' | 'organizationLogo' | 'url' | 'chipLabel'
>): ResolvedSource {
  const isExternal = Boolean(url)
  const domain = url ? deriveDomain(url) : ''
  return {
    isExternal,
    domain,
    resolvedChipLabel:
      chipLabel ?? (isExternal ? domain : `${organization} internal data`),
    resolvedLogo:
      organizationLogo ?? (isExternal ? <FaviconImg domain={domain} /> : null),
  }
}

interface SourceBodyProps {
  organization: string
  title: string
  description: string
  url?: string
  internalFooter: string
  resolved: ResolvedSource
}

function SourceBody({
  organization,
  title,
  description,
  url,
  internalFooter,
  resolved,
}: SourceBodyProps): React.JSX.Element {
  const { isExternal, domain, resolvedLogo } = resolved
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-medium text-muted-foreground">
          Source
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <span className="flex size-3.5 shrink-0 items-center justify-center">
            {resolvedLogo}
          </span>
          <span>1 source</span>
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm text-foreground">
        <span className="flex size-4 shrink-0 items-center justify-center">
          {resolvedLogo}
        </span>
        <span>{organization}</span>
      </div>
      {isExternal && url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-1 text-base font-semibold text-components-input-active hover:underline"
        >
          <span>{title}</span>
          <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
        </a>
      ) : (
        <p className="text-base font-semibold text-foreground">{title}</p>
      )}
      <p className="text-sm text-muted-foreground">{description}</p>
      <p className="text-xs text-muted-foreground">
        {isExternal ? domain : internalFooter}
      </p>
    </>
  )
}

const CHIP_CLASS_BASE =
  'inline-flex items-center gap-1.5 rounded-md border border-base-border bg-base-surface px-2 py-1 text-xs text-foreground transition-colors hover:bg-accent focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none'

function DesktopSourceCitation(props: SourceCitationProps): React.JSX.Element {
  const {
    organization,
    title,
    description,
    url,
    internalFooter = 'Internal data — not publicly linkable.',
    className,
  } = props
  const resolved = resolveSource(props)
  const { resolvedChipLabel, resolvedLogo } = resolved

  const [hovered, setHovered] = React.useState(false)
  const [pinned, setPinned] = React.useState(false)
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const open = hovered || pinned

  const cancelClose = React.useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])
  const scheduleClose = React.useCallback(() => {
    cancelClose()
    closeTimer.current = setTimeout(() => setHovered(false), CLOSE_DELAY_MS)
  }, [cancelClose])
  React.useEffect(() => () => cancelClose(), [cancelClose])

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setPinned(false)
          setHovered(false)
          cancelClose()
        }
      }}
    >
      <PopoverAnchor asChild>
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setPinned((p) => !p)}
          onMouseEnter={() => {
            cancelClose()
            setHovered(true)
          }}
          onMouseLeave={scheduleClose}
          className={cn(CHIP_CLASS_BASE, className)}
        >
          <span className="flex size-4 shrink-0 items-center justify-center">
            {resolvedLogo}
          </span>
          <span className="font-medium">{resolvedChipLabel}</span>
        </button>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={6}
        className="w-80 space-y-2 p-4"
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        <SourceBody
          organization={organization}
          title={title}
          description={description}
          url={url}
          internalFooter={internalFooter}
          resolved={resolved}
        />
      </PopoverContent>
    </Popover>
  )
}

function MobileSourceCitation(props: SourceCitationProps): React.JSX.Element {
  const {
    organization,
    title,
    description,
    url,
    internalFooter = 'Internal data — not publicly linkable.',
    className,
  } = props
  const resolved = resolveSource(props)
  const { resolvedChipLabel, resolvedLogo } = resolved

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button
          type="button"
          aria-haspopup="dialog"
          className={cn(CHIP_CLASS_BASE, className)}
        >
          <span className="flex size-4 shrink-0 items-center justify-center">
            {resolvedLogo}
          </span>
          <span className="font-medium">{resolvedChipLabel}</span>
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle className="sr-only">Source: {organization}</DrawerTitle>
        <DrawerClose className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
          <X className="size-5" aria-hidden="true" />
          <span className="sr-only">Close</span>
        </DrawerClose>
        <div className="space-y-2 px-4 pt-6 pb-8">
          <SourceBody
            organization={organization}
            title={title}
            description={description}
            url={url}
            internalFooter={internalFooter}
            resolved={resolved}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function SourceCitation(props: SourceCitationProps): React.JSX.Element {
  const isMobile = useIsMobile()
  return isMobile ? (
    <MobileSourceCitation {...props} />
  ) : (
    <DesktopSourceCitation {...props} />
  )
}

export { SourceCitation, type SourceCitationProps }
